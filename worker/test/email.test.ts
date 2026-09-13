import { describe, expect, test } from "bun:test";

import { classify, extractJobs, preview, type ParsedMail } from "../src/Email.ts";

const mail = (over: Partial<ParsedMail>): ParsedMail => ({
  from: "jobs-noreply@linkedin.com",
  fromName: "LinkedIn",
  subject: "5 new jobs for Full Stack Developer",
  text: "",
  html: "",
  messageId: "<x@linkedin.com>",
  receivedAt: "2026-09-13T08:00:00Z",
  ...over,
});

describe("email classification", () => {
  test("linkedin job alert and message", () => {
    expect(classify(mail({}))).toBe("linkedin-alert");
    expect(classify(mail({ from: "messages-noreply@linkedin.com", subject: "You have a new message" }))).toBe("linkedin-message");
  });
  test("upwork alert and djinni message", () => {
    expect(classify(mail({ from: "donotreply@upwork.com", subject: "New jobs matching your search" }))).toBe("upwork-alert");
    expect(classify(mail({ from: "notify@djinni.co", subject: "Роботодавець відповів на ваш відгук" }))).toBe("djinni-message");
    expect(classify(mail({ from: "noreply@djinni.co", subject: "Нові вакансії для вас" }))).toBe("djinni-alert");
  });
  test("unknown senders", () => {
    expect(classify(mail({ from: "forwarding-noreply@google.com", subject: "Gmail Forwarding Confirmation" }))).toBe("unknown");
  });
});

describe("job extraction", () => {
  test("linkedin links with anchor titles", () => {
    const html = `<a href="https://www.linkedin.com/comm/jobs/view/4123456789/?trk=x">Full Stack Developer (Remote)</a> Acme GmbH · Vienna
      <a href="https://www.linkedin.com/comm/jobs/view/4123456789/?trk=y">Full Stack Developer (Remote)</a>`;
    const jobs = extractJobs(mail({ html }), "linkedin-alert");
    expect(jobs.length).toBe(1);
    expect(jobs[0]!.url).toBe("https://www.linkedin.com/jobs/view/4123456789");
    expect(jobs[0]!.title).toBe("Full Stack Developer (Remote)");
    expect(jobs[0]!.snippet).toContain("Acme GmbH");
  });
  test("upwork links", () => {
    const html = `<a href="https://www.upwork.com/jobs/Next-js-dashboard_~021234567890123456/?referrer_url_path=x">Next.js dashboard</a> Fixed price $800`;
    const jobs = extractJobs(mail({ from: "donotreply@upwork.com", html }), "upwork-alert");
    expect(jobs.length).toBe(1);
    expect(jobs[0]!.externalId).toBe("21234567890123456");
    expect(jobs[0]!.snippet).toContain("$800");
  });
  test("preview truncates", () => {
    expect(preview(mail({ text: "a".repeat(600) }), 100).length).toBe(101);
  });
});
