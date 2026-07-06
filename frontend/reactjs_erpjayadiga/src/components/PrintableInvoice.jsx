import React, { useState } from "react";
import { Download, X } from "lucide-react";
import html2pdf from "html2pdf.js";

const PrintableInvoice = ({ data, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!data) return null;

  // 1. FORMATTER
  const formatAngka = (number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // 2. LOGIKA ITEM
  const items = data.items || [];
  const barangItems = items.filter(
    (item) => item.item_type === "barang" || !item.item_type,
  );
  const dpItems = items.filter((item) => item.item_type === "dp");
  const pelunasanItems = items.filter((item) => item.item_type === "pelunasan");

  const subtotalBarang = barangItems.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );
  const subtotalDp = dpItems.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );
  const subtotalPelunasan = pelunasanItems.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );

  const namaBarangText = barangItems.map((item) => item.description).join(", ");

  // 3. FUNGSI DOWNLOAD
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById("invoice-content");

      const opt = {
        margin: 0,
        filename: `${data.invoice_code || "Invoice"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          scrollY: 0,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await new Promise((resolve) => setTimeout(resolve, 150));
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-row items-start justify-center gap-6 max-w-full p-4 min-h-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          .font-roboto { font-family: 'Roboto', sans-serif; }
          .no-split { page-break-inside: avoid; }
        `}
      </style>

      {/* BALANCER KIRI (Menjaga Kertas A4 Tepat di Tengah Layar) */}
      <div className="w-48 shrink-0 hidden lg:block print:hidden"></div>

      {/* AREA KERTAS A4 */}
      <div
        id="invoice-content"
        className="w-[210mm] bg-[#FFFFFF] text-[#000000] font-roboto text-[11pt] shadow-lg overflow-hidden box-border px-[20mm] py-[20mm] shrink-0"
        style={{ minHeight: "296mm" }}
      >
        {/* HEADER */}
        <div className="text-center pb-2">
          <h1 className="text-2xl font-bold text-[#1A3263] tracking-wide uppercase">
            JAYA DIGA INNOVATION
          </h1>
          <p className="text-[#1A3263] font-medium text-sm">
            Steel Fabrication , Mechanical Enginering , Construction
          </p>
          <p className="text-[#1A3263] text-[9pt]">
            Jl. Madrasah Pangkalan 5, RT02 / RW03, Ciketing Udik, Bantar Gebang,
            Kota Bekasi.
          </p>
        </div>

        {/* DOUBLE LINE HEADER */}
        <div className="border-b border-[#1A3263] w-full"></div>
        <div className="border-b border-[#1A3263] w-full mt-[1.5px] mb-6"></div>

        {/* META DATA */}
        <div className="flex justify-between mb-8 text-[10pt]">
          <div className="w-1/2 pr-4">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-20 py-0.5 font-medium align-top">Nomor</td>
                  <td className="w-3 py-0.5 align-top">:</td>
                  <td className="py-0.5 align-top">
                    {data.invoice_code || `INV-${data.id}`}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 font-medium align-top">Perihal</td>
                  <td className="w-3 py-0.5 align-top">:</td>
                  <td className="py-0.5 align-top">Invoice</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-medium align-top">Lampiran</td>
                  <td className="w-3 py-0.5 align-top">:</td>
                  <td className="py-0.5 align-top">1 lembar</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-medium align-top">Revisi</td>
                  <td className="w-3 py-0.5 align-top">:</td>
                  <td className="py-0.5 align-top">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-1/2 flex justify-end">
            <table className="w-auto text-left">
              <tbody>
                <tr>
                  <td className="w-16 py-0.5 font-medium align-top">Kepada</td>
                  <td className="w-3 py-0.5 align-top">:</td>
                  <td className="py-0.5 align-top">
                    {data.client?.company || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 font-medium align-top">Alamat</td>
                  <td className="w-3 py-0.5 align-top">:</td>
                  <td className="py-0.5 leading-tight align-top">
                    {data.client?.address || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 font-medium align-top">No Telp</td>
                  <td className="w-3 py-0.5 align-top">:</td>
                  <td className="py-0.5 align-top">
                    {data.client?.contact || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PEMBUKA */}
        <div className="mb-4 text-[10pt]">
          <p className=" mb-1 leading-relaxed">Dengan Hormat,</p>
          <p className="leading-relaxed">
            Berikut saya lampirkan Invoice untuk{" "}
            {namaBarangText || "pekerjaan tersebut"} dengan rincian sebagai
            berikut:
          </p>
        </div>

        {/* TABEL RINCIAN (Anti-Crash Version: No Flexbox, No H-Full) */}
        <table className="w-full border-collapse border border-[#000000] mb-8 text-[10pt]">
          <thead className="bg-[#9ccaff] font-bold">
            <tr>
              <th className="border border-[#000000] py-2.5 w-10 align-middle">
                No
              </th>
              <th className="border border-[#000000] py-2.5 align-middle">
                Description
              </th>
              <th className="border border-[#000000] py-2.5 w-24 align-middle">
                Qty
              </th>
              <th className="border border-[#000000] py-2.5 w-32 align-middle">
                Harga Satuan
              </th>
              <th className="border border-[#000000] py-2.5 w-36 align-middle">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="border border-[#000000] py-4 text-[#9CA3AF] italic align-middle text-center"
                >
                  (Tidak ada rincian item)
                </td>
              </tr>
            )}

            {/* 1. LOOPING BARANG / PEKERJAAN */}
            {barangItems.map((item, index) => (
              <tr key={index}>
                <td className="border border-[#000000] text-center align-middle py-2.5">
                  {index + 1}
                </td>
                <td className="border border-[#000000] text-left px-2 align-middle py-2.5">
                  {item.description}
                </td>
                <td className="border border-[#000000] px-2 align-middle py-2.5">
                  {/* Diganti menjadi float agar library PDF membacanya dengan sempurna */}
                  <span className="float-left">{item.qty}</span>
                  <span className="float-right">{item.unit}</span>
                  <div className="clear-both"></div>
                </td>
                <td className="border border-[#000000] text-right pr-2 align-middle py-2.5">
                  {formatAngka(item.unit_price)}
                </td>
                <td className="border border-[#000000] text-right pr-2 align-middle py-2.5">
                  {formatAngka(item.subtotal)}
                </td>
              </tr>
            ))}

            {/* Subtotal Barang */}
            {(dpItems.length > 0 || pelunasanItems.length > 0) && (
              <tr>
                <td
                  colSpan="4"
                  className="border border-[#000000] text-right pr-2 py-2.5 font-bold italic align-middle"
                >
                  Subtotal
                </td>
                <td className="border border-[#000000] text-right pr-2 py-2.5 font-bold align-middle">
                  {formatAngka(subtotalBarang)}
                </td>
              </tr>
            )}

            {/* 2. LOOPING UANG MUKA (DP) */}
            {dpItems.length > 0 && (
              <>
                <tr className="font-bold border-y border-[#000000] bg-[#F9FAFB]">
                  <td className="border-x border-[#000000] text-center italic py-2.5 align-middle">
                    #
                  </td>
                  <td
                    colSpan="4"
                    className="border-x border-[#000000] text-left px-2 py-2.5 align-middle"
                  >
                    Uang Muka / DP :
                  </td>
                </tr>
                {dpItems.map((item, i) => (
                  <tr key={i}>
                    <td
                      colSpan="2"
                      className="border border-[#000000] text-left px-2 align-middle py-2.5"
                    >
                      {item.description}
                    </td>
                    <td className="border border-[#000000] px-2 align-middle py-2.5">
                      <span className="float-left">{item.qty}</span>
                      <span className="float-right">{item.unit}</span>
                      <div className="clear-both"></div>
                    </td>
                    <td className="border border-[#000000] text-right pr-2 align-middle py-2.5">
                      {formatAngka(item.unit_price)}
                    </td>
                    <td className="border border-[#000000] text-right pr-2 align-middle py-2.5">
                      {formatAngka(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </>
            )}

            {/* 3. LOOPING PELUNASAN */}
            {pelunasanItems.length > 0 && (
              <>
                <tr className="font-bold border-y border-[#000000] bg-[#FDE047]">
                  <td className="border-x border-[#000000] text-center italic py-2.5 align-middle">
                    #
                  </td>
                  <td
                    colSpan="4"
                    className="border-x border-[#000000] text-left px-2 py-2.5 align-middle"
                  >
                    Pelunasan :
                  </td>
                </tr>
                {pelunasanItems.map((item, i) => (
                  <tr key={i}>
                    <td
                      colSpan="2"
                      className="border border-[#000000] text-left px-2 align-middle py-2.5"
                    >
                      {item.description}
                    </td>
                    <td className="border border-[#000000] px-2 align-middle py-2.5">
                      <span className="float-left">{item.qty}</span>
                      <span className="float-right">{item.unit}</span>
                      <div className="clear-both"></div>
                    </td>
                    <td className="border border-[#000000] text-right pr-2 align-middle py-2.5">
                      {formatAngka(item.unit_price)}
                    </td>
                    <td className="border border-[#000000] text-right pr-2 align-middle py-2.5">
                      {formatAngka(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>

          {/* GRAND TOTAL DARI DATABASE (DIPISAH KOLOMNYA AGAR TATA LETAK SEMPURNA) */}
          <tfoot className="bg-[#9ccaff] font-bold">
            <tr>
              <td
                colSpan="3"
                className="border border-[#000000] py-2.5 text-center align-middle"
              >
                Grand Total
              </td>
              <td className="border border-[#000000] py-2.5 text-right pr-2 align-middle">
                Rp :
              </td>
              <td className="border border-[#000000] text-right pr-2 py-2.5 bg-[#FDE047] align-middle text-[11pt]">
                {formatAngka(data.total)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* FOOTER */}
        <div className="mb-10 text-[10pt]">
          <p className=" mb-1 leading-relaxed">
            Demikian Invoice ini saya sampaikan.
          </p>
          <p className="leading-relaxed">
            Atas perhatian dan kerja samanya saya ucapkan terima kasih.
          </p>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex justify-between items-start no-split">
          <div className="w-[45%]">
            <div className="border border-[#000000] p-3 mb-4">
              <p className="mb-2 text-[9pt] font-bold ">
                Metode Pembayaran (Tunai, Transfer) :
              </p>
              <table className="text-[9pt] w-full">
                <tbody>
                  <tr>
                    <td className="w-12 font-medium">Bank</td>
                    <td>: BCA</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Nomor</td>
                    <td>: 56 80 80 69 61</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Nama</td>
                    <td>: Agus priyono</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-[10pt]">
              <p className="font-bold mb-1">Notes :</p>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-b border-[#000000] h-5 w-full"
                ></div>
              ))}
            </div>
          </div>

          <div className="w-[45%] flex flex-col items-center">
            <p className="text-[10pt] mb-2">
              Bekasi, {formatDate(data.invoice_date)}
            </p>
            <div className="h-24 w-36 mb-1">
              <img
                src="/ttd_aguspriyono.png"
                alt="Signature"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <p className="font-bold text-[10pt]">Agus Priyono</p>
            <p className="text-[9pt] ">Phone : 0813 8715 0615</p>
            <p className="text-[9pt] ">Email : jayadigainnovation@gmail.com</p>
          </div>
        </div>
      </div>

      {/* PANEL TOMBOL DI KANAN KERTAS A4 */}
      <div className="w-48 shrink-0 flex flex-col gap-3 print:hidden sticky top-6">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="w-full whitespace-nowrap px-4 py-2.5 bg-[#1A3263] text-[#FFFFFF] rounded-lg font-bold hover:bg-[#122345] transition shadow-md disabled:opacity-75 flex items-center justify-center cursor-pointer"
        >
          <Download size={18} className="inline mr-2 shrink-0" />
          {isDownloading ? "Memproses..." : "Download PDF"}
        </button>

        <button
          onClick={onClose}
          disabled={isDownloading}
          className="w-full whitespace-nowrap px-4 py-2.5 bg-[#FEF2F2] text-[#DC2626] rounded-lg font-bold hover:bg-[#FEE2E2] transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          <X size={18} className="inline mr-2 shrink-0" />
          Tutup
        </button>
      </div>
    </div>
  );
};

export default PrintableInvoice;
