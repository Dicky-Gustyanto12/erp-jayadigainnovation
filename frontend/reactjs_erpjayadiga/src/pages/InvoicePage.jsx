import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Eye,
  Plus,
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  PlusCircle,
  FolderPlus,
  Tag,
  ChevronUp,
  ChevronDown,
  AlignJustify,
} from "lucide-react";
import Swal from "sweetalert2";
import PrintableInvoice from "../components/PrintableInvoice";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [poSearch, setPoSearch] = useState("");
  const [isPoDropdownOpen, setIsPoDropdownOpen] = useState(false);
  const poDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (poDropdownRef.current && !poDropdownRef.current.contains(event.target)) {
        setIsPoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const defaultItem = {
    item_type: "barang",
    description: "",
    qty: "",
    unit: "",
    unit_price: "",
    subtotal: "",
    is_highlighted: true,
  };

  const [formData, setFormData] = useState({
    client_id: "",
    project_id: "",
    purchase_order_id: "",
    total: 0,
    invoice_date: "",
    due_date: "",
    status: "Pending",
    items: [defaultItem],
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [resInvoices, resClients, resProjects, resPurchaseOrders] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/invoices", config),
        axios.get("http://127.0.0.1:8000/api/clients", config),
        axios.get("http://127.0.0.1:8000/api/projects", config),
        axios.get("http://127.0.0.1:8000/api/purchase-orders", config),
      ]);
      setInvoices(resInvoices.data.data);
      setClients(resClients.data.data);
      setProjects(resProjects.data.data);
      setPurchaseOrders(resPurchaseOrders.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const calculatedTotal = formData.items.reduce((sum, item) => {
      if (
        item.item_type !== "kategori" &&
        item.item_type !== "kosong" &&
        item.is_highlighted
      ) {
        return sum + (Number(item.subtotal) || 0);
      }
      return sum;
    }, 0);
    setFormData((prev) => ({ ...prev, total: calculatedTotal }));
  }, [formData.items]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, maximumFractionDigits: 10
    }).format(number || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "client_id") {
      setFormData({ ...formData, client_id: value, project_id: "", purchase_order_id: "" });
      setPoSearch("");
    }
    else setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { ...defaultItem, is_highlighted: true }],
    });
  };

  const handleAddCategory = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          item_type: "kategori",
          description: "",
          qty: "",
          unit: "",
          unit_price: "",
          subtotal: "",
          is_highlighted: true,
        },
      ],
    });
  };

  const handleAddSpacing = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          item_type: "kosong",
          description: "",
          qty: "",
          unit: "",
          unit_price: "",
          subtotal: "",
          is_highlighted: false,
        },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newItems = [...formData.items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setFormData({ ...formData, items: newItems });
  };

  const moveItemDown = (index) => {
    if (index === formData.items.length - 1) return;
    const newItems = [...formData.items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setFormData({ ...formData, items: newItems });
  };


  
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (
      (field === "qty" || field === "unit_price" || field === "math_operator" || field === "math_operand") &&
      newItems[index].item_type !== "kategori" &&
      newItems[index].item_type !== "kosong"
    ) {
      let rawQ = (newItems[index].qty || "").toString().replace(',', '.');
      const q = rawQ === "" ? 0 : Number(rawQ);
      
      let rawP = (newItems[index].unit_price || "").toString().replace(',', '.');
      let p = rawP === "" ? 0 : Number(rawP);
      
      const op = newItems[index].math_operator;
      let rawOpVal = (newItems[index].math_operand || "").toString().replace(',', '.');
      const opVal = rawOpVal === "" ? null : Number(rawOpVal);
      
      if (op && opVal !== null && !isNaN(opVal)) {
          if (op === '/') p /= opVal;
          else if (op === '*') p *= opVal;
          else if (op === '-') p -= opVal;
          else if (op === '+') p += opVal;
      }

      if (newItems[index].qty === "" && newItems[index].unit_price === "") {
        newItems[index].subtotal = "";
      } else {
        newItems[index].subtotal = q * p;
      }
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleOpenAdd = () => {
    setFormData({
      client_id: "",
      project_id: "",
      purchase_order_id: "",
      total: 0,
      invoice_date: "",
      due_date: "",
      status: "Pending",
      items: [{ ...defaultItem, is_highlighted: true }],
    });
    setIsEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inv) => {
    const processedItems =
      inv.items && inv.items.length > 0
        ? inv.items.map((i) => {
          const type = i.item_type || "barang";

          // PERBAIKAN: Hanya mengambil nilai bulat-bulat dari Database, tidak lagi asal ceklis!
          let checked = i.is_highlighted == 1 || i.is_highlighted === true;

          return {
            ...i,
            item_type: type,
            is_highlighted: checked,
            qty: i.qty == 0 || i.qty == null ? "" : parseFloat(i.qty),
            unit: i.unit == "-" || i.unit == null ? "" : i.unit,
            unit_price: i.unit_price == 0 || i.unit_price == null ? "" : parseFloat(i.unit_price),
            math_operator: i.math_operator || "",
            math_operand: i.math_operand == null ? "" : parseFloat(i.math_operand),
            subtotal: i.subtotal == 0 || i.subtotal == null ? "" : parseFloat(i.subtotal),
          };
        })
        : [{ ...defaultItem, is_highlighted: true }];

    setFormData({
      client_id: inv.client_id || "",
      project_id: inv.project_id || "",
      purchase_order_id: inv.purchase_order_id || "",
      total: inv.total || 0,
      invoice_date: inv.invoice_date || "",
      due_date: inv.due_date || "",
      status: inv.status || "Pending",
      items: processedItems,
    });
    const relatedPo = inv.purchase_order || inv.purchaseOrder;
    setPoSearch(relatedPo ? `${relatedPo.po_code} - ${formatDate(relatedPo.po_date)} - ${relatedPo.total ? formatRupiah(relatedPo.total) : ""}` : "");
    setIsEditMode(true);
    setEditId(inv.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanItems = formData.items.map((item) => ({
      ...item,
      description: item.item_type === "kosong" ? "-" : item.description || "-",
      qty: item.qty === "" || item.qty === null ? null : Number(item.qty.toString().replace(',', '.')),
      unit: item.unit === "" || item.unit === null ? null : item.unit,
      unit_price:
        item.unit_price === "" || item.unit_price === null
          ? null
          : Number(item.unit_price.toString().replace(',', '.')),
      math_operator: item.math_operator || null,
      math_operand: item.math_operand === "" || item.math_operand == null ? null : Number(item.math_operand.toString().replace(',', '.')),
      subtotal:
        item.subtotal === "" || item.subtotal === null
          ? null
          : Number(item.subtotal),
    }));

    const payload = { ...formData, items: cleanItems };

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (isEditMode) {
        await axios.put(
          `http://127.0.0.1:8000/api/invoices/${editId}`,
          payload,
          config,
        );
        Swal.fire({
          icon: "success",
          title: "Diperbarui!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/invoices", payload, config);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.response?.data?.message || "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, code) => {
    Swal.fire({
      title: "Hapus Invoice?",
      text: `Hapus ${code}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://127.0.0.1:8000/api/invoices/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchData();
        } catch (error) {
          Swal.fire({ icon: "error", title: "Gagal" });
        }
      }
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Invoice
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola dan pantau semua tagihan beserta rincian itemnya.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1A3263] px-5 py-2.5 rounded-lg text-white font-bold hover:bg-[#122345] transition shadow-md cursor-pointer"
        >
          <Plus size={20} /> Buat Invoice Baru
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari klien atau nomor invoice..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer">
          <Filter size={20} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left table-auto min-w-max">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="py-4 px-6">ID Invoice</th>
                <th className="py-4 px-6">Klien</th>
                <th className="py-4 px-6">Jatuh Tempo</th>
                <th className="py-4 px-6 text-right">Grand Total Tagihan</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Sedang memuat data...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Belum ada data invoice.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-bold text-[#1A3263]">
                      {inv.invoice_code || `INV-${inv.id}`}
                    </td>
                    <td className="py-4 px-6 text-gray-700 font-medium">
                      {inv.client?.company || (
                        <span className="text-red-400 italic">Tanpa Klien</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {formatDate(inv.due_date)}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900 text-right">
                      {formatRupiah(inv.total)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${(inv.status || "PENDING").toUpperCase() === "LUNAS" ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-100 text-orange-700 border-orange-200"}`}
                      >
                        {(inv.status || "PENDING").toUpperCase() === "PENDING"
                          ? "BELUM LUNAS"
                          : inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Lihat/Cetak Invoice"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(inv)}
                          className="text-amber-500 hover:text-amber-700 transition"
                          title="Edit Invoice"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              inv.id,
                              inv.invoice_code || `INV-${inv.id}`,
                            )
                          }
                          className="text-red-500 hover:text-red-700 transition"
                          title="Hapus Invoice"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-5xl my-auto">
            <PrintableInvoice
              data={selectedInvoice}
              onClose={() => setSelectedInvoice(null)}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="bg-[#1A3263] px-6 py-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold text-lg">
                {isEditMode ? "Edit Invoice & Rincian" : "Buat Invoice Baru"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-blue-200 hover:text-white transition cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto flex-1 flex flex-col gap-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pilih Klien
                  </label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      -- Pilih Klien --
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div ref={poDropdownRef} className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Berdasarkan Purchase Order (PO)
                  </label>
                  <input
                    type="text"
                    value={poSearch}
                    onChange={(e) => {
                      setPoSearch(e.target.value);
                      setIsPoDropdownOpen(true);
                      setFormData(prev => ({ ...prev, purchase_order_id: "" }));
                    }}
                    onClick={() => setIsPoDropdownOpen(true)}
                    placeholder={!formData.client_id ? "-- Pilih Client dahulu --" : "-- Pilih PO --"}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none ${!formData.client_id ? "placeholder-gray-400 text-gray-400 bg-gray-50" : "placeholder-gray-900 text-gray-900 bg-white"}`}
                    disabled={isSubmitting || !formData.client_id}
                  />
                  <div 
                    className={`absolute right-3 top-[34px] cursor-pointer ${!formData.client_id ? "text-gray-400" : "text-gray-900"}`} 
                    onClick={() => {
                        if (formData.client_id && !isSubmitting) {
                            setIsPoDropdownOpen(!isPoDropdownOpen);
                        }
                    }}
                  >
                    <ChevronDown size={18} className={!formData.client_id ? "text-gray-400" : "text-gray-900"} />
                  </div>
                  {isPoDropdownOpen && formData.client_id && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500 italic text-sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, purchase_order_id: "" }));
                          setPoSearch("");
                          setIsPoDropdownOpen(false);
                        }}
                      >
                        -- Kosongkan PO --
                      </div>
                      {purchaseOrders
                        .filter(po => String(po.client_id) === String(formData.client_id))
                        .filter(po =>
                          poSearch === "" ||
                          (po.po_code + " - " + formatDate(po.po_date) + " - " + (po.total ? formatRupiah(po.total) : "")).toLowerCase().includes(poSearch.toLowerCase())
                        )
                        .map(po => (
                          <div
                            key={po.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, purchase_order_id: po.id }));
                              setPoSearch(`${po.po_code} - ${formatDate(po.po_date)} - ${po.total ? formatRupiah(po.total) : ""}`);
                              setIsPoDropdownOpen(false);
                            }}
                          >
                            {po.po_code} - {formatDate(po.po_date)} - {po.total ? formatRupiah(po.total) : ""}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    name="invoice_date"
                    value={formData.invoice_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-800 border-b-2 border-[#1A3263] pb-1">
                    Rincian Pekerjaan / Tagihan
                  </h4>
                  <div className="flex gap-2">
                    {/* PERBAIKAN: Tombol Tambah Jarak Kosong */}
                    <button
                      type="button"
                      onClick={handleAddSpacing}
                      className="flex items-center gap-1.5 text-sm bg-gray-50 text-gray-600 px-3 py-1.5 rounded font-bold hover:bg-gray-100 transition border border-gray-200 cursor-pointer"
                    >
                      <AlignJustify size={16} /> Tambah Jarak
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded font-bold hover:bg-blue-100 transition border border-blue-200 cursor-pointer"
                    >
                      <FolderPlus size={16} /> Tambah Kategori
                    </button>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-1.5 text-sm bg-[#1A3263] text-white px-3 py-1.5 rounded font-bold hover:bg-[#122345] transition shadow-sm cursor-pointer"
                    >
                      <PlusCircle size={16} /> Tambah Baris
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 w-32">Tipe Baris</th>
                        <th className="py-3 px-4 min-w-[200px]">
                          Deskripsi Pekerjaan
                        </th>
                        <th className="py-3 px-4 w-24">Qty</th>
                        <th className="py-3 px-4 w-24">Satuan</th>
                        <th className="py-3 px-4 w-32">Harga Satuan</th>
                          <th className="py-3 px-4 w-[140px]">Perhitungan</th>
                        <th className="py-3 px-4 w-32 text-right">Subtotal</th>
                        <th className="py-3 px-4 w-24 text-center bg-yellow-100 text-yellow-800">
                          Tandai
                        </th>
                        <th className="py-3 px-4 w-28 text-center">
                          Urutan / Hapus
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.items.map((item, index) => {
                        const isCategory = item.item_type === "kategori";
                        const isSpacing = item.item_type === "kosong";
                        return (
                          <tr
                            key={index}
                            className={`hover:bg-gray-50 ${isCategory || isSpacing ? "bg-gray-50" : ""}`}
                          >
                            <td className="p-2 font-semibold text-gray-600">
                              {isCategory ? (
                                <span className="flex items-center gap-1.5 text-[#1A3263]">
                                  <Tag size={16} /> Kategori
                                </span>
                              ) : isSpacing ? (
                                <span className="flex items-center gap-1.5 text-gray-400">
                                  <AlignJustify size={16} /> Jarak
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-gray-600">
                                  Pekerjaan
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              {isSpacing ? (
                                <div className="text-gray-400 italic px-2">
                                  -- Baris Kosong (Hanya Jarak) --
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  placeholder={
                                    isCategory
                                      ? "Kategori (Misal: Area Outbound)"
                                      : "Contoh: Flying Fox"
                                  }
                                  className={`w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none bg-white ${isCategory ? "font-bold" : ""}`}
                                />
                              )}
                            </td>
                            <td className="p-2">
                              {!isCategory && !isSpacing ? (
                                <input type="text"
                                  
                                  value={item.qty}
                                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none text-center bg-white"
                                />
                              ) : (
                                <div className="text-center text-gray-300">
                                  -
                                </div>
                              )}
                            </td>
                            <td className="p-2">
                              {!isCategory && !isSpacing ? (
                                <input
                                  type="text"
                                  value={item.unit}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "unit",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="ls/unit"
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none text-center bg-white"
                                />
                              ) : (
                                <div className="text-center text-gray-300">
                                  -
                                </div>
                              )}
                            </td>
                            <td className="p-2">
                              {!isCategory && !isSpacing ? (
                                <input type="text"
                                  value={item.unit_price}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "unit_price",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none bg-white"
                                />
                              ) : (
                                <div className="text-center text-gray-300">
                                  -
                                </div>
                              )}
                            </td>
                            <td className="p-2">
                              {!isCategory && !isSpacing ? (
                                <div className="flex gap-1 items-center justify-center">
                                  <select
                                    value={item.math_operator || ""}
                                    onChange={(e) => handleItemChange(index, "math_operator", e.target.value)}
                                    className="w-10 p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none bg-white"
                                  >
                                    <option value=""></option>
                                    <option value="/">/</option>
                                    <option value="*">x</option>
                                    <option value="-">-</option>
                                    <option value="+">+</option>
                                  </select>
                                  <input type="text"
                                    
                                    value={item.math_operand || ""}
                                    onChange={(e) => handleItemChange(index, "math_operand", e.target.value)}
                                    className="w-16 p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none text-center bg-white"
                                  />
                                </div>
                              ) : (
                                <div className="text-center text-gray-300">-</div>
                              )}
                            </td>
                            <td
                              className={`p-2 text-right font-bold ${isCategory || isSpacing ? "text-gray-300" : "text-gray-700 bg-gray-50"}`}
                            >
                              {isCategory || isSpacing
                                ? "-"
                                : item.subtotal
                                  ? formatRupiah(item.subtotal)
                                  : "Rp 0"}
                            </td>
                            <td className="p-2 text-center bg-yellow-50 border-l border-yellow-100">
                              <input
                                type="checkbox"
                                checked={item.is_highlighted}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "is_highlighted",
                                    e.target.checked,
                                  )
                                }
                                className="w-5 h-5 text-yellow-500 rounded border-gray-300 cursor-pointer disabled:opacity-30"
                                title="Centang untuk memberi tanda di Invoice PDF"
                                disabled={isSpacing}
                              />
                            </td>
                            <td className="p-2 text-center border-l border-gray-100">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => moveItemUp(index)}
                                  disabled={index === 0}
                                  className="text-gray-400 hover:text-blue-600 disabled:opacity-30 transition cursor-pointer"
                                  title="Naik"
                                >
                                  <ChevronUp size={20} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveItemDown(index)}
                                  disabled={index === formData.items.length - 1}
                                  className="text-gray-400 hover:text-blue-600 disabled:opacity-30 transition cursor-pointer"
                                  title="Turun"
                                >
                                  <ChevronDown size={20} />
                                </button>
                                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-red-400 hover:text-red-600 disabled:opacity-30 transition cursor-pointer"
                                  disabled={formData.items.length === 1}
                                  title="Hapus Baris"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-yellow-50 border-t-2 border-yellow-300">
                      <tr>
                        <td
                          colSpan="7"
                          className="py-3 px-4 text-right font-bold text-gray-700"
                        >
                          GRAND TOTAL TAGIHAN SAAT INI:
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#1A3263] text-lg bg-yellow-100">
                          {formatRupiah(formData.total)}
                        </td>
                        <td
                          colSpan="7"
                          className="text-xs text-yellow-700 px-2 italic"
                        >
                          *Hanya menghitung yang ditandai
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-end border-t border-gray-100 pt-5 mt-auto">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Status Pembayaran
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none bg-white font-medium text-gray-800"
                    disabled={isSubmitting}
                  >
                    <option value="Pending">Pending / Belum Lunas</option>
                    <option value="Lunas">Lunas (Tercatat di Arus Kas)</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none px-6 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none px-6 py-2.5 text-white font-bold bg-[#1A3263] hover:bg-[#122345] rounded-lg transition shadow-md cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting
                      ? "Menyimpan..."
                      : isEditMode
                        ? "Update Master & Rincian"
                        : "Simpan Invoice"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
