import React, { useState } from "react";
import { Printer, X } from "lucide-react";

const PrintableInvoice = ({ data, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  if (!data) return null;

  const formatAngka = (number) => {
    return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(
      number || 0,
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  let itemCounter = 1;

  return (
    <div className="flex flex-row items-start justify-center gap-6 max-w-full p-4 min-h-screen print:p-0 print:m-0 print:bg-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          
          .font-roboto { font-family: 'Roboto', sans-serif; }
          .no-split { page-break-inside: avoid; }

          /* ========================================== */
          /* PENGATURAN KHUSUS CETAK NATIVE BROWSER     */
          /* ========================================== */
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            @page {
              size: A4 portrait;
              margin: 0mm; 
            }

            body * {
              visibility: hidden;
            }

            #invoice-content, #invoice-content * {
              visibility: visible;
            }

            #invoice-content {
              position: absolute;
              left: 0;
              top: 0;
              margin: 0 !important;
              padding: 15mm 20mm !important;
              box-shadow: none !important;
              width: 210mm !important;
              height: 297mm !important;
            }

            .fixed.inset-0 {
              background: none !important;
              backdrop-filter: none !important;
            }
          }
        `}
      </style>

      <div className="w-48 shrink-0 hidden lg:block print:hidden"></div>

      <div
        id="invoice-content"
        className="w-[210mm] bg-[#FFFFFF] text-[#000000] font-roboto text-[11pt] shadow-lg overflow-hidden box-border px-[20mm] py-[20mm] shrink-0 print:shadow-none"
        style={{ minHeight: "296mm" }}
      >
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

        <div className="border-b border-[#1A3263] w-full"></div>
        <div className="border-b border-[#1A3263] w-full mt-[1.5px] mb-6"></div>

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
                  <td className="py-0.5 font-medium align-top">Tanggal</td>
                  <td className="w-3 py-0.5 align-top">:</td>
                  <td className="py-0.5 align-top">
                    {formatDate(data.invoice_date)}
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

        <div className="mb-4 text-[10pt]">
          <p className=" mb-1 leading-relaxed">Dengan Hormat,</p>
          <p className="leading-relaxed">
            Berikut saya lampirkan Invoice untuk pekerjaan tersebut dengan
            rincian sebagai berikut:
          </p>
        </div>

        <table className="w-full border-collapse border border-[#000000] mb-8 text-[10pt]">
          <thead className="bg-[#9ccaff] font-bold">
            <tr>
              <th className="border border-[#000000] py-2 w-10 align-middle">
                No
              </th>
              <th className="border border-[#000000] py-2 align-middle">
                Description
              </th>
              <th className="border border-[#000000] py-2 w-24 align-middle">
                Qty
              </th>
              <th className="border border-[#000000] py-2 w-32 align-middle">
                Harga Satuan
              </th>
              <th className="border border-[#000000] py-2 w-36 align-middle">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {!data.items || data.items.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="border border-[#000000] py-4 text-[#9CA3AF] italic align-middle text-center"
                >
                  (Tidak ada rincian item)
                </td>
              </tr>
            ) : (
              data.items.map((item, index) => {
                // 1. DETEKSI BARIS JARAK (KOSONG)
                const isSpacing =
                  item.item_type?.toLowerCase() === "kosong" ||
                  item.description === "-";

                // 2. DETEKSI KATEGORI (Pastikan bukan isSpacing)
                const isCategory =
                  !isSpacing &&
                  (item.item_type?.toLowerCase() === "kategori" ||
                    (Number(item.qty) === 0 &&
                      Number(item.unit_price) === 0 &&
                      Number(item.subtotal) === 0));

                // LOGIKA 1: JIKA BARIS JARAK
                if (isSpacing) {
                  return (
                    <tr key={index} className="border-y border-[#000000]">
                      {/* Diberikan div dengan h-5 agar ada jarak spasi yang nyata, tapi isinya kosong melompong */}
                      <td className="border-x border-[#000000] bg-[#FFFFFF]">
                        <div className="h-5 w-full"></div>
                      </td>
                      <td className="border-x border-[#000000] bg-[#FFFFFF]"></td>
                      <td className="border-x border-[#000000] bg-[#FFFFFF]"></td>
                      <td className="border-x border-[#000000] bg-[#FFFFFF]"></td>
                      <td className="border-x border-[#000000] bg-[#FFFFFF]"></td>
                    </tr>
                  );
                }

                // LOGIKA 2: JIKA KATEGORI
                if (isCategory) {
                  itemCounter = 1; // Reset Nomor
                  const bgDescYellow = item.is_highlighted
                    ? "bg-[#FDE047]"
                    : "bg-[#FFFFFF]";

                  return (
                    <tr key={index} className="border-y border-[#000000]">
                      <td className="border-x border-[#000000] text-center font-bold py-0.5 align-middle bg-[#FFFFFF]">
                        #
                      </td>
                      <td
                        className={`border-x border-[#000000] text-left font-bold px-2 py-0.5 align-middle ${bgDescYellow}`}
                      >
                        {item.description}
                      </td>
                      <td className="border-x border-[#000000] px-2 align-middle py-0.5 bg-[#FFFFFF]"></td>
                      <td className="border-x border-[#000000] text-right pr-2 align-middle py-0.5 bg-[#FFFFFF]"></td>
                      <td className="border-x border-[#000000] text-right pr-2 align-middle py-0.5 bg-[#FFFFFF]"></td>
                    </tr>
                  );
                }

                // LOGIKA 3: JIKA PEKERJAAN NORMAL
                const currentNum = itemCounter++;

                return (
                  <tr key={index} className="border-y border-[#000000]">
                    <td className="border-x border-[#000000] text-center align-middle py-0.5 bg-[#FFFFFF]">
                      {currentNum}
                    </td>
                    <td className="border-x border-[#000000] text-left px-2 align-middle py-0.5 bg-[#FFFFFF]">
                      {item.description}
                    </td>
                    <td className="border-x border-[#000000] px-2 align-middle py-0.5 bg-[#FFFFFF]">
                      <div className="flex justify-between w-full">
                        <span>{item.qty || ""}</span>
                        <span>{item.unit || ""}</span>
                      </div>
                    </td>
                    <td className="border-x border-[#000000] text-right pr-2 align-middle py-0.5 bg-[#FFFFFF]">
                      {item.unit_price ? formatAngka(item.unit_price) : ""}
                    </td>
                    <td className="border-x border-[#000000] text-right pr-2 align-middle py-0.5 bg-[#FFFFFF]">
                      {item.subtotal ? formatAngka(item.subtotal) : ""}
                    </td>
                  </tr>
                );
              })
            )}

            {data.items && data.items.length > 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="border-y border-l border-[#000000] py-2 text-center font-bold align-middle bg-[#FFFFFF]"
                  style={{ borderRight: "none" }}
                >
                  Sub Total
                </td>
                <td
                  className="border-y border-r border-[#000000] py-2 bg-[#FFFFFF]"
                  style={{ borderLeft: "none" }}
                ></td>
                <td className="border border-[#000000] text-right pr-2 py-2 font-bold align-middle bg-[#FDE047]">
                  {formatAngka(data.total)}
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="bg-[#9ccaff] font-bold">
            <tr>
              <td
                colSpan="3"
                className="border-y border-l border-[#000000] py-2 text-center align-middle"
                style={{ borderRight: "none" }}
              >
                Grand Total
              </td>
              <td
                className="border-y border-r border-[#000000] py-2 text-right pr-2 align-middle"
                style={{ borderLeft: "none" }}
              >
                Rp :
              </td>
              <td className="border border-[#000000] text-right pr-2 py-2 align-middle bg-[#FDE047]">
                {formatAngka(data.total)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mb-10 text-[10pt]">
          <p className=" mb-1 leading-relaxed">
            Demikian Invoice ini saya sampaikan.
          </p>
          <p className="leading-relaxed">
            Atas perhatian dan kerja samanya saya ucapkan terima kasih.
          </p>
        </div>

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

      <div className="w-48 shrink-0 flex flex-col gap-3 print:hidden sticky top-6">
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="w-full whitespace-nowrap px-4 py-2.5 bg-[#1A3263] text-[#FFFFFF] rounded-lg font-bold hover:bg-[#122345] transition shadow-md disabled:opacity-75 flex items-center justify-center cursor-pointer"
        >
          <Printer size={18} className="inline mr-2 shrink-0" />{" "}
          {isPrinting ? "Mempersiapkan..." : "Cetak / Simpan PDF"}
        </button>
        <button
          onClick={onClose}
          disabled={isPrinting}
          className="w-full whitespace-nowrap px-4 py-2.5 bg-[#FEF2F2] text-[#DC2626] rounded-lg font-bold hover:bg-[#FEE2E2] transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          <X size={18} className="inline mr-2 shrink-0" /> Tutup
        </button>
      </div>
    </div>
  );
};

export default PrintableInvoice;
