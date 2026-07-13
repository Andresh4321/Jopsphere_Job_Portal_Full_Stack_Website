import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const offerLettersDir = path.join(__dirname, "../../public/offer_letters");
if (!fs.existsSync(offerLettersDir)) {
  fs.mkdirSync(offerLettersDir, { recursive: true });
}

interface OfferLetterData {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  salary: number;
  startDate: Date;
  responseWindowDays: number;
  message: string;
}

// Generates a simple, professional offer letter PDF and returns its public path.
export const generateOfferLetterPdf = (data: OfferLetterData): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filename = `${uuidv4()}.pdf`;
    const filePath = path.join(offerLettersDir, filename);
    const publicPath = `/offer_letters/${filename}`;

    const doc = new PDFDocument({ margin: 60 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).font("Helvetica-Bold").text(data.companyName, { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(11).font("Helvetica").fillColor("#666666").text(
      `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
    );
    doc.moveDown(1.5);

    doc.fillColor("#000000").fontSize(16).font("Helvetica-Bold").text("Offer of Employment");
    doc.moveDown(1);

    doc.fontSize(11).font("Helvetica").text(`Dear ${data.candidateName},`);
    doc.moveDown(0.8);

    doc.text(
      `We are pleased to offer you the position of ${data.jobTitle} at ${data.companyName}. ` +
        `This letter outlines the key terms of our offer.`,
      { align: "left" }
    );
    doc.moveDown(1);

    const rows: [string, string][] = [
      ["Position", data.jobTitle],
      ["Monthly Salary", `NPR ${data.salary.toLocaleString("en-IN")}`],
      [
        "Proposed Start Date",
        data.startDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      ],
      ["Response Window", `${data.responseWindowDays} day(s) from today`],
    ];

    rows.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").text(`${label}: `, { continued: true }).font("Helvetica").text(value);
    });

    if (data.message.trim()) {
      doc.moveDown(1);
      doc.font("Helvetica-Bold").text("A note from the employer:");
      doc.font("Helvetica").text(data.message.trim());
    }

    doc.moveDown(1.5);
    doc.text(
      "This offer, including salary and start date, can still be discussed and adjusted through Jopsphere before both parties confirm."
    );
    doc.moveDown(1.5);
    doc.text("We look forward to the possibility of you joining our team.");
    doc.moveDown(1);
    doc.font("Helvetica-Bold").text(data.companyName);

    doc.end();

    stream.on("finish", () => resolve(publicPath));
    stream.on("error", reject);
  });
};