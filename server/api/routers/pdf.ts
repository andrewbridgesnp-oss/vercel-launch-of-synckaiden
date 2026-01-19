import { z } from "zod";
import { protectedProcedure, router } from "../../_core/trpc";
import { 
  generatePDF, 
  generateContractPDF, 
  generateInvoicePDF, 
  generateLLCDocumentPDF,
  generateCreditLetterPDF 
} from "../../services/pdfGenerator";
import { storagePut } from "../../storage";

export const pdfRouter = router({
  // Generate generic PDF document
  generateDocument: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      subtitle: z.string().optional(),
      companyName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const buffer = await generatePDF(input);
      const filename = `documents/${Date.now()}-${input.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      const { url } = await storagePut(filename, buffer, 'application/pdf');
      return { url, filename };
    }),

  // Generate LLC Articles of Organization or Operating Agreement
  generateLLCDocument: protectedProcedure
    .input(z.object({
      type: z.enum(['articles', 'operating']),
      state: z.string(),
      companyName: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = await generateLLCDocumentPDF(input);
      const docType = input.type === 'articles' ? 'articles-of-organization' : 'operating-agreement';
      const filename = `llc/${Date.now()}-${input.companyName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${docType}.pdf`;
      const { url } = await storagePut(filename, buffer, 'application/pdf');
      return { url, filename };
    }),

  // Generate Contract PDF
  generateContract: protectedProcedure
    .input(z.object({
      title: z.string(),
      parties: z.array(z.string()),
      terms: z.string(),
      date: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = await generateContractPDF(input);
      const filename = `contracts/${Date.now()}-${input.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      const { url } = await storagePut(filename, buffer, 'application/pdf');
      return { url, filename };
    }),

  // Generate Invoice PDF
  generateInvoice: protectedProcedure
    .input(z.object({
      invoiceNumber: z.string(),
      date: z.string(),
      dueDate: z.string(),
      from: z.object({
        name: z.string(),
        address: z.string(),
        email: z.string(),
      }),
      to: z.object({
        name: z.string(),
        address: z.string(),
        email: z.string(),
      }),
      items: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        rate: z.number(),
      })),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const buffer = await generateInvoicePDF(input);
      const filename = `invoices/${Date.now()}-invoice-${input.invoiceNumber}.pdf`;
      const { url } = await storagePut(filename, buffer, 'application/pdf');
      return { url, filename };
    }),

  // Generate Credit Dispute Letter PDF
  generateCreditLetter: protectedProcedure
    .input(z.object({
      type: z.string(),
      recipientName: z.string(),
      recipientAddress: z.string(),
      content: z.string(),
      senderName: z.string(),
      senderAddress: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = await generateCreditLetterPDF(input);
      const filename = `credit-letters/${Date.now()}-${input.type.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      const { url } = await storagePut(filename, buffer, 'application/pdf');
      return { url, filename };
    }),
});
