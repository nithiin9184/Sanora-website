export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalDocument = {
  title: string;
  description: string;
  introduction: string;
  sections: LegalSection[];
  contacts: { label: string; email: string }[];
};

export const securityNotice = "Official Security Notice: Only packages downloaded directly from sanoramusic.in are authentic and verified. The SANORA team assumes zero liability or responsibility for APK files obtained from third-party websites, mirror portals, or modified sources.";

const definition = "SANORA Music is a client-side media player, personal DSP equalizer, and public metadata organizing utility.";

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  description: "How SANORA Music handles profile information, local preferences, payments, privacy rights, and official package safety.",
  introduction: `${definition} This policy explains our minimalist approach to information when you use the official application or sanoramusic.in.`,
  contacts: [{ label: "Privacy and legal requests", email: "legal@sanoramusic.in" }, { label: "Account deletion and support", email: "support@sanoramusic.in" }],
  sections: [
    {
      id: "scope", title: "1. Scope and responsibility",
      paragraphs: ["This policy covers information handled by SANORA in connection with its official website and application. Independent sign-in providers, payment gateways, and external websites operate under their own policies. We cannot control the privacy or security practices of unauthorized packages or third-party distributors.", "The security notice above concerns official package authenticity. It is not a guarantee that any software is immune to every vulnerability, and it does not exclude any responsibility that applicable law does not allow us to exclude."],
    },
    {
      id: "information", title: "2. Information we collect and keep",
      paragraphs: ["We collect only the user-provided profile information needed for an account: your email address and display name supplied through Google Sign-In. We do not receive or store your Google account password.", "Local application preferences include equalizer presets, user-created playlists, and liked tracks. These preferences are kept in application storage on your device. They may be removed when you clear application data or uninstall the app; device backups are controlled by your device and backup provider."],
      items: ["Profile information: email address and display name for sign-in, account administration, and support.", "Local preferences: equalizer presets, playlists, and liked tracks for your personal settings and library.", "Information you voluntarily send in a support or legal request, limited to what is needed to handle that request."],
    },
    {
      id: "audio", title: "3. Audio and listening privacy",
      paragraphs: ["SANORA does not record or intercept your personal listening audio. We do not sell your personal listening habits to third-party data brokers.", "Your liked tracks and playlists are personal preferences used to organize your library, not a profile sold to advertisers. Basic operational telemetry is intended for service health and troubleshooting, not to build a commercial listening-history profile."],
    },
    {
      id: "purposes", title: "4. Why information is used",
      paragraphs: ["We use limited information to authenticate your account, retain your selected settings, administer access to paid features, answer your requests, maintain security, and diagnose operational problems.", "Where a legal basis is required, processing is based on providing the service you request, proportionate legitimate interests in security and operation, compliance with legal obligations, or your consent where required. You may withdraw consent for optional processing without affecting the lawfulness of earlier processing."],
    },
    {
      id: "payments", title: "5. Payment information",
      paragraphs: ["Payments are processed strictly through Razorpay, a secure third-party payment gateway operating under PCI-DSS compliant payment processing requirements. SANORA never stores credit or debit card numbers or CVVs on its servers.", "Limited transaction information, such as a payment reference, status, and purchased entitlement, may be used to confirm access, resolve payment queries, or satisfy accounting obligations. Razorpay handles payment credentials under its own privacy and payment terms. Do not send full card details or CVVs to SANORA support."],
    },
    {
      id: "storage", title: "6. Cookies, sessions, and operational telemetry",
      paragraphs: ["We use minimal session storage and similar essential technologies to maintain sign-in state, protect sessions, and remember basic preferences. Basic operational telemetry may include error reports, approximate timestamps, app or browser version, and technical request information needed to diagnose reliability or abuse.", "We do not use this policy as consent for advertising trackers or the sale of listening data. If optional analytics requiring consent are introduced, the appropriate choice will be provided before their use. You can clear cookies and application storage through your browser or device settings; doing so may sign you out or reset preferences."],
    },
    {
      id: "sharing", title: "7. Limited disclosure and external services",
      paragraphs: ["We do not sell personal information. Limited data may be shared with service providers only as needed for sign-in, payments, operational security, or support, subject to applicable safeguards. Information may also be disclosed where lawfully required or necessary to protect legal rights, users, or service security.", "An external link does not mean SANORA controls that destination. Third-party providers may process data in other jurisdictions; their policies describe their processing locations and safeguards. Where applicable law requires safeguards for a transfer made by us, we use the required safeguards."],
    },
    {
      id: "retention", title: "8. Retention and security",
      paragraphs: ["Account profile data is kept only for as long as needed to provide your account or handle a legitimate legal obligation. Support records and operational information are retained only as necessary for their stated purpose. Local preferences remain under your device's storage controls.", "We use reasonable technical and organizational safeguards appropriate to the limited data processed. No network, device, or storage system is completely secure. Keep your device updated, protect your sign-in account, and obtain the application only from sanoramusic.in."],
    },
    {
      id: "rights", title: "9. Your rights and account deletion",
      paragraphs: ["You may request account deletion and a wipe of personal data at any time by contacting support@sanoramusic.in or legal@sanoramusic.in. You may also request access, correction, a copy of your data, or restriction or objection to processing where applicable law provides those rights.", "We may ask for proportionate proof that the account is yours before acting. We will handle requests without undue delay and within applicable legal deadlines. We will delete data under our control unless retention is legally required; if an exception applies, we will explain it and limit use of the retained information. Backup copies may remain until their normal secure expiry.", "An account deletion request does not automatically clear storage on your device or data held independently by Google or Razorpay. Clear application storage for local preferences and contact the relevant provider for its independently held records. You may raise a privacy grievance with the legal contact below and, where applicable, the relevant regulator."],
    },
    {
      id: "children", title: "10. Children and guardians",
      paragraphs: ["SANORA is not directed at children who cannot legally consent to the relevant processing. Where a user is a minor under applicable law, use must be supervised by a parent or lawful guardian and any required parental consent must be obtained. We do not knowingly collect children's information without required authorization. Contact us if you believe such information has been provided so that we can investigate and remove it where required."],
    },
    {
      id: "changes", title: "11. Changes and contact",
      paragraphs: ["We may revise this policy to reflect changes in the service or applicable law. The current version and update date will be published here. Material changes will be communicated as required by law; a policy revision does not remove existing statutory rights.", "For privacy questions, account deletion, or a data-rights request, use the contacts below. Please include your account email and the nature of the request, but do not include passwords or payment credentials."],
    },
  ],
};

export const termsOfService: LegalDocument = {
  title: "Terms of Service",
  description: "SANORA Music terms for official APK distribution, personal use, playlist metadata, warranties, and liability.",
  introduction: `${definition} These terms govern use of the official application and sanoramusic.in. Please read them before downloading or using the service.`,
  contacts: [{ label: "Legal questions", email: "legal@sanoramusic.in" }, { label: "Application and payment support", email: "support@sanoramusic.in" }],
  sections: [
    {
      id: "acceptance", title: "1. Acceptance and eligibility",
      paragraphs: ["By downloading the APK from sanoramusic.in or using the service, you agree to these Terms of Service and acknowledge the Privacy Policy. If you do not agree, do not download or use SANORA.", "You must have legal capacity to accept these terms. If you are a minor, a parent or lawful guardian must authorize and supervise your use where required by applicable law. You are responsible for complying with the laws that apply to your use."],
    },
    {
      id: "distribution", title: "2. Official distribution and third-party risk",
      paragraphs: ["The official SANORA application is exclusively distributed via sanoramusic.in. Installing, downloading, or running APK binaries from unauthorized third-party repositories, Telegram channels, APK mirror websites, or modified packages is strictly at the user's sole risk. SANORA disclaims all liability for malware, compromised security, data loss, or device damage resulting from non-official distributions.", "We do not authorize, verify, maintain, or support third-party packages or modifications. A copied logo, similar name, or claimed association does not establish authenticity. Download directly from sanoramusic.in and do not rely on an unauthorized distributor's assurances.", "To the maximum extent permitted by applicable law, SANORA assumes no responsibility for third-party distribution, tampering, impersonation, malicious code, unauthorized access, or resulting losses. This clause does not exclude non-waivable statutory duties or liability that the law prohibits us from limiting."],
    },
    {
      id: "license", title: "3. Limited license and personal use",
      paragraphs: ["Subject to these terms, SANORA grants a limited, non-exclusive, non-transferable, revocable license to use the software strictly for private, non-commercial, personal entertainment and media organization. No ownership of the software or any third-party media is transferred.", "You must not use SANORA for commercial broadcasting, public performance, unauthorized redistribution, infringement, interference with service security, or other unlawful activity. Do not circumvent access restrictions or digital rights protections. Any statutory rights to interoperability, inspection, or other lawful use remain unaffected."],
    },
    {
      id: "playlists", title: "4. Universal playlist tool and lawful use",
      paragraphs: ["The playlist import feature simply reads publicly shared text/metadata links to organize the user's personal media library. Its purpose is to organize descriptive information such as song titles, artist names, album information, and playlist order. Importing metadata does not transfer audio ownership or grant a license to any recording.", "You must have permission or another valid legal basis to use the links and media you direct the application to access. Public accessibility alone does not mean that material is free of copyright or permitted for every use. Nothing in these terms guarantees that a particular activity qualifies as fair use, fair dealing, or another copyright exception; those exceptions depend on the law and circumstances."],
    },
    {
      id: "accounts", title: "5. Accounts, settings, and security",
      paragraphs: ["Provide accurate account information and protect your sign-in account and device. Do not share access in a way that enables misuse. Notify support if you believe your account or the official application has been compromised.", "Local settings and personal library preferences may be affected by clearing application data, device failure, or uninstalling. Maintain any backups you need. Our handling of personal information is described in the Privacy Policy."],
    },
    {
      id: "payments", title: "6. Paid features and payment terms",
      paragraphs: ["Where paid features are offered, the price, duration, and material conditions shown at purchase apply. Payments are processed by Razorpay under its applicable payment terms; SANORA does not store full card numbers or CVVs.", "Do not assume that a purchase renews automatically unless renewal is expressly disclosed and authorized at checkout. Promotions may have disclosed eligibility or availability limits. Contact support for payment, access, cancellation, or refund questions. Nothing here overrides mandatory cancellation, refund, or consumer-protection rights."],
    },
    {
      id: "copyright", title: "7. Intellectual property and third-party material",
      paragraphs: ["SANORA's name, branding, and software are protected by applicable intellectual property law, subject to any separately applicable open-source or third-party licenses. Artists, labels, copyright holders, and other rightsholders retain all rights in their works and marks.", "SANORA grants no rights in third-party recordings, artwork, lyrics, or metadata beyond what their owners or applicable law permit. Availability, accuracy, and external access may change. No affiliation, endorsement, or authorization by a rightsholder should be inferred solely from indexing or display."],
    },
    {
      id: "warranty", title: "8. AS-IS and AS-AVAILABLE service",
      paragraphs: ["To the maximum extent permitted by law, the application and website are provided on an 'AS-IS' and 'AS-AVAILABLE' basis, without express or implied warranties, including warranties of merchantability, fitness for a particular purpose, or non-infringement.", "We do not warrant uninterrupted uptime, error-free operation, compatibility with every device, continued availability of any external resource, or complete protection from security threats. Maintenance, updates, outages, and external changes may affect the service. Warranties that cannot lawfully be excluded remain in force."],
    },
    {
      id: "liability", title: "9. Limitation of liability",
      paragraphs: ["To the maximum extent permitted by applicable law, SANORA and its team are not liable for indirect, incidental, special, consequential, or punitive losses, including loss of data, profits, goodwill, or use, arising from use of or inability to use the application, external resources, or non-official packages.", "You remain responsible for your device, network access, lawful media use, and reasonable backups. Nothing in these terms excludes or limits liability for fraud, deliberate misconduct, death or personal injury where such an exclusion is unlawful, or any other liability or consumer right that cannot legally be excluded or limited."],
    },
    {
      id: "suspension", title: "10. Suspension and termination",
      paragraphs: ["We may restrict or terminate access where reasonably necessary to address unlawful activity, a material breach, security risks, or a legal requirement. Where practical and lawful, we will provide notice and an opportunity to resolve the issue. You may stop using the service at any time and request account deletion.", "Termination does not extinguish accrued payment obligations, valid legal claims, or statutory refund rights. Provisions that by their nature must survive termination, including intellectual property and lawful limitations of liability, continue to apply."],
    },
    {
      id: "law", title: "11. Applicable law and disputes",
      paragraphs: ["These terms are governed by the laws of India, subject to mandatory protections that apply in your place of residence. Disputes may be brought before a court or authority with lawful jurisdiction; these terms do not require you to waive a mandatory consumer forum or remedy.", "Please first contact legal@sanoramusic.in with the relevant facts so we can attempt a good-faith resolution. This request does not prevent you from exercising legal rights or meeting a filing deadline. If a provision is unenforceable, the remaining provisions apply to the extent lawful."],
    },
    {
      id: "changes", title: "12. Changes and contact",
      paragraphs: ["We may update these terms as the service or law changes. Updated terms will be posted with a revised date, and material changes will be notified as required. Changes will not retroactively remove accrued rights. If you do not accept a future change, stop using the service; mandatory rights remain unaffected.", "For legal questions or concerns about official distribution, contact the legal address below. For application or payment assistance, contact support."],
    },
  ],
};

export const dmcaDisclaimer: LegalDocument = {
  title: "DMCA & Copyright Disclaimer",
  description: "SANORA Music's copyright position, rightsholder notice procedure, counter-notices, and copyright contact.",
  introduction: `${definition} We respect the rights of artists, music labels, copyright owners, and their authorized representatives. This page explains how to report a specific copyright concern.`,
  contacts: [{ label: "Copyright notices and counter-notices", email: "dmca@sanoramusic.in" }, { label: "Other legal matters", email: "legal@sanoramusic.in" }],
  sections: [
    {
      id: "status", title: "1. Intermediary and indexing status",
      paragraphs: ["SANORA Music does not host, store, broadcast, upload, or own any copyrighted audio files or master recordings on its servers. The application functions strictly as a client-side player and indexing tool that interfaces with publicly accessible streams and user-directed media indexes.", "Playlist organization concerns publicly shared text and metadata. SANORA does not claim ownership of indexed works or grant users a right to copy, distribute, publicly perform, or otherwise exploit them. A resource being publicly accessible is not, by itself, a copyright license."],
    },
    {
      id: "respect", title: "2. Respect for intellectual property",
      paragraphs: ["All copyrights and related rights in recordings, compositions, artwork, lyrics, artist names, and label marks remain with their respective owners. SANORA acknowledges and respects copyright holders, artists, and music labels.", "References or metadata are for identification and personal organization and do not imply sponsorship, partnership, or endorsement. Users must obtain any permissions required for their use and comply with applicable copyright law. No blanket claim of fair use or fair dealing is made."],
    },
    {
      id: "notice", title: "3. Submit a copyright notice",
      paragraphs: ["Send a written notice to dmca@sanoramusic.in with the subject 'Copyright Takedown Notice'. For a notice under the U.S. Digital Millennium Copyright Act (17 U.S.C. § 512), include all of the following. For a claim under another jurisdiction, identify the applicable law and provide equivalent details sufficient to evaluate the claim."],
      items: ["Your full name, contact email, postal address, and telephone number, and whether you are the owner or an authorized agent.", "Identification of the copyrighted work, including the exact song title and artist; for multiple works at one location, a representative list.", "The exact URL or other precise location of the material or index entry you claim is infringing, with the song title, artist, and enough detail for us to locate it. A screenshot may supplement, but does not replace, a precise location.", "Proof of copyright ownership or your authority to act for the owner, such as a rights reference, registration if available, or authorization documentation. Registration is not a prerequisite where the law does not require it.", "A statement that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.", "A statement that the information in your notice is accurate and, under penalty of perjury, that you are the owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.", "Your physical or electronic signature; a typed full name intended as a signature may serve as an electronic signature."],
    },
    {
      id: "response", title: "4. Review and notice-and-takedown response",
      paragraphs: ["Upon receipt of a valid, sufficiently specific notice, we aim to review and take appropriate compliance action within 48 to 72 business hours. This is an operational response target, not a promise of a fixed outcome, a delay entitlement, or an override of any shorter legal requirement. We act expeditiously where the law requires it.", "Appropriate action may include disabling or removing the identified link, metadata entry, or access through functionality under our control, and notifying the affected user where appropriate. We may request clarification when a notice is incomplete or does not identify a locatable item.", "SANORA cannot delete material from an independent website or another party's systems. For removal at the source, you may also need to contact its operator. We may retain limited records needed to document the claim, response, and compliance obligations."],
    },
    {
      id: "counter", title: "5. Counter-notification for mistaken removal",
      paragraphs: ["If your material or index entry was disabled due to a copyright notice and you believe this resulted from mistake or misidentification, you may send a counter-notification to dmca@sanoramusic.in. Where the U.S. DMCA applies, your counter-notification must include:"],
      items: ["Your physical or electronic signature.", "Identification of the material removed or disabled and the location where it appeared before removal or disabling.", "A statement under penalty of perjury that you have a good-faith belief the material was removed or disabled as a result of mistake or misidentification.", "Your full name, postal address, and telephone number, plus a contact email.", "A statement consenting to the jurisdiction of the Federal District Court for the judicial district in which your address is located or, if your address is outside the United States, for any judicial district in which the service provider may be found, and agreeing to accept service of process from the person who submitted the notice or their agent."],
    },
    {
      id: "restoration", title: "6. Counter-notice handling and restoration",
      paragraphs: ["Where the U.S. DMCA counter-notice process applies, a valid counter-notification may be forwarded to the original complainant. The complainant may receive the contact information supplied in the counter-notification.", "Unless we receive notice that the complainant has filed a court action seeking to restrain the relevant activity, the statutory process generally permits restoration no sooner than 10 and no later than 14 business days after receiving a valid counter-notification, subject to applicable law and lawful independent grounds for keeping access restricted. These statutory business-day periods are distinct from our 48–72 business-hour initial response target.", "For other jurisdictions, we follow the applicable review and dispute procedure. Seek independent legal advice before submitting a notice or counter-notice if you are unsure of your rights."],
    },
    {
      id: "misuse", title: "7. Misrepresentation and repeat infringement",
      paragraphs: ["Submit notices in good faith and consider applicable licenses and copyright exceptions before alleging infringement. Knowingly materially misrepresenting infringement or mistaken removal may create liability under applicable law, including 17 U.S.C. § 512(f) where it applies.", "In appropriate circumstances and where account functionality allows, SANORA may restrict or terminate users who repeatedly infringe copyright, consistent with applicable law. Attempts to reintroduce lawfully removed entries or evade restrictions may result in further action."],
    },
    {
      id: "scope", title: "8. Legal scope and official package safety",
      paragraphs: ["This page describes our copyright complaint process; it is not a legal determination that every use is lawful, a claim of registered DMCA agent status, or a guarantee of statutory safe-harbor eligibility. Legal protections depend on the actual facts and applicable requirements.", "The U.S. DMCA applies only where legally relevant. Rights and obligations under Indian copyright law and other applicable laws remain unaffected. Nothing here limits a rightsholder's non-waivable remedies or excuses unlawful conduct.", "Our process covers functionality under SANORA's control, not unauthorized APKs, third-party modifications, or independent distributors. Only packages downloaded directly from sanoramusic.in are official."],
    },
    {
      id: "contact", title: "9. Copyright contact and updates",
      paragraphs: ["Send takedown notices and counter-notifications directly to dmca@sanoramusic.in. Send other legal enquiries to legal@sanoramusic.in. Do not send passwords, card numbers, CVVs, or unrelated sensitive documents.", "We may update this procedure to reflect operational or legal changes. The current version is published on this page with its update date."],
    },
  ],
};

export function legalHead(path: string, document: LegalDocument) {
  return {
    meta: [
      { title: `${document.title} — SANORA Music` },
      { name: "description", content: document.description },
      { property: "og:title", content: `${document.title} — SANORA Music` },
      { property: "og:description", content: document.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}

export type HighlightSegment = { text: string; tone?: "green" | "red" };

const greenTerms = [
  "sanoramusic.in are authentic and verified",
  "support@sanoramusic.in",
  "legal@sanoramusic.in",
  "dmca@sanoramusic.in",
  "sanoramusic.in",
  "Official Security Notice",
  "Razorpay",
  "PCI-DSS",
  "Google Sign-In",
  "Privacy Policy",
  "Terms of Service",
  "account deletion",
  "48 to 72 business hours",
  "10 and no later than 14 business days",
  "17 U.S.C. § 512(f)",
  "17 U.S.C. § 512",
  "DMCA",
  "never stores credit or debit card numbers or CVVs",
  "do not sell personal information",
  "do not record or intercept your personal listening audio",
  "do not sell your personal listening habits",
  "exclusively distributed via sanoramusic.in",
  "limited, non-exclusive, non-transferable, revocable license",
  "private, non-commercial, personal entertainment",
  "governed by the laws of India",
  "good-faith belief",
  "physical or electronic signature",
  "backups you need",
];

const redTerms = [
  "assumes zero liability or responsibility",
  "malware, compromised security, data loss, or device damage",
  "sole risk",
  "no network, device, or storage system is completely secure",
  "under penalty of perjury",
  "penalty of perjury",
  "'AS-IS'",
  "'AS-AVAILABLE'",
  "without express or implied warranties",
  "not liable for indirect, incidental, special, consequential, or punitive losses",
  "tampering, impersonation, malicious code, unauthorized access, or resulting losses",
  "may restrict or terminate users who repeatedly infringe copyright",
  "Knowingly materially misrepresenting infringement or mistaken removal may create liability",
  "do not send passwords, card numbers, CVVs, or unrelated sensitive documents",
  "Do not send full card details or CVVs to SANORA support",
  "unauthorized third-party repositories, Telegram channels, APK mirror websites, or modified packages",
  "non-official packages",
  "non-official distributions",
  "Do not circumvent access restrictions or digital rights protections",
  "cannot delete material from an independent website or another party's systems",
  "Keep your device updated, protect your sign-in account, and obtain the application only from sanoramusic.in",
  "No blanket claim of fair use or fair dealing is made",
  "is not, by itself, a copyright license",
  "not a promise of a fixed outcome",
  "unauthorized packages or third-party distributors",
  "no ads, no tracking, no hidden charges",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightLegalText(text: string): HighlightSegment[] {
  const pattern = new RegExp(
    `(${[...redTerms, ...greenTerms].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`,
    "gi",
  );
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ text: text.slice(lastIndex, index) });
    const matched = match[0];
    const isRed = redTerms.some((term) => term.toLowerCase() === matched.toLowerCase());
    segments.push({ text: matched, tone: isRed ? "red" : "green" });
    lastIndex = index + matched.length;
  }
  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex) });
  return segments;
}