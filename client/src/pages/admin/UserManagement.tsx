export { UserManagement } from "./UserManagementModern";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Search, IdCard, ArrowDownUp } from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { SkeletonTable } from "../../components/admin/SkeletonLoader";
import { useAuth } from "../../context/AuthContext";
import { roleMatchesAny } from "../../config/roleTemplates";
import { Link } from "react-router";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  fakultas: string;
}

const MOCK_USERS: UserItem[] = [
  { id: "USR-001", name: "Raka Pratama", email: "raka.pratama@pradita.ac.id", role: "Administrator", fakultas: "-" },
  { id: "USR-002", name: "", email: "edison@contoh.com", role: "Dosen", fakultas: "-" },
  { id: "USR-003", name: "Nadia Diandra, S.T.,M.T.", email: "nadia.diandra@pradita.ac.id", role: "Dosen", fakultas: "Fakultas Teknik" },
  { id: "USR-004", name: "Belinda Prameswari, S.T.,M.Eng.", email: "belinda.prameswari@pradita.ac.id", role: "Dosen", fakultas: "Fakultas Teknik" },
  { id: "USR-005", name: "Dr. Farhan Mahendra, S.T., M.T., M.B.A.", email: "farhan.mahendra@pradita.ac.id", role: "Dosen", fakultas: "Fakultas Teknik" },
  { id: "USR-006", name: "Rizal Saputra, S.T., M.T.", email: "rizal.saputra@pradita.ac.id", role: "Dosen", fakultas: "Fakultas Teknik" },
  { id: "USR-007", name: "Ida Ayu Sawitri Dian Mawarni, S.T.,M.T.", email: "ida.ayu@pradita.ac.id", role: "Dosen", fakultas: "Fakultas Teknik" },
  { id: "USR-008", name: "Deasy Olivia, S.T.,M.T.", email: "deasy.olivia@pradita.ac.id", role: "Dosen", fakultas: "Fakultas Desain" },
  { id: "USR-009", name: "Rendi Akbar Pratama", email: "rendi.akbar@pradita.ac.id", role: "Dosen", fakultas: "Fakultas Teknologi" },
  { id: "USR-010", name: "Aditya Firmansyah, S.T.,M.T.", email: "aditya.firmansyah@pradita.ac.id", role: "Dosen", fakultas: "Fakultas Teknik" },
];

function LegacyUserManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", variant: "danger" as const, onConfirm: () => {} });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const filtered = MOCK_USERS.filter((u) => {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const isReadOnly = roleMatchesAny(user?.role, ["hrd"]) && !roleMatchesAny(user?.role, ["administrator"]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(paginated.map(u => u.id));
    else setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <PageWrapper title="User Management" subtitle="Daftar User" breadcrumbs={[{ label: "Master Data" }, { label: "User Management" }]}>
      {loading ? <SkeletonTable rows={10} /> : (
        <div className="bg-white border-t-[3px] border-t-[#00c0ef] shadow-sm rounded-sm text-[#212529] font-[Helvetica_Neue,Helvetica,Arial,sans-serif]">
          
          {/* Top Controls: Show entries & Search & Main Buttons */}
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Show Entries */}
            <div className="flex items-center gap-2 text-[15px] text-[#333]">
              <span>Show</span>
              <select 
                value={perPage} 
                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-[#ccc] rounded-sm px-2 py-1 bg-white focus:outline-none focus:border-[#3c8dbc] h-8"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            {/* Right Controls: Search & Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-[15px] text-[#333]">
                <span>Search:</span>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="border border-[#ccc] rounded-sm px-3 py-1 bg-white focus:outline-none focus:border-[#3c8dbc] transition-colors w-[200px] h-8"
                />
              </div>

              {!isReadOnly && (
                <div className="flex items-center gap-[2px] ml-2">
                  <button className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] font-bold text-white bg-[#00a65a] hover:bg-[#008d4c] border border-[transparent] rounded-[3px] transition-colors h-[34px]">
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Tambah
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] font-bold text-white bg-[#dd4b39] hover:bg-[#d73925] border border-[transparent] rounded-[3px] transition-colors h-[34px]">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} /> Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full px-4 pb-4">
            <table className="w-full text-[15px] border-b border-[#f4f4f4]">
              <thead>
                <tr className="border-y border-[#f4f4f4]">
                  <th className="px-2 py-2.5 w-[40px] text-center align-middle font-bold text-[#333] border-r border-[#f4f4f4]">
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-[#ccc]"
                      onChange={handleSelectAll}
                      checked={paginated.length > 0 && selectedIds.length === paginated.length}
                    />
                  </th>
                  <th className="px-2 py-2.5 text-left align-middle font-bold text-[#333] border-r border-[#f4f4f4] hover:bg-[#f9f9f9] cursor-pointer w-[30%]">
                    <div className="flex items-center justify-between">
                      Nama
                      <div className="flex flex-col text-[#ccc]">
                        <ArrowDownUp className="w-3 h-3" strokeWidth={3} />
                      </div>
                    </div>
                  </th>
                  <th className="px-2 py-2.5 text-left align-middle font-bold text-[#333] border-r border-[#f4f4f4] hover:bg-[#f9f9f9] cursor-pointer w-[40%]">
                    <div className="flex items-center justify-between">
                      Email
                      <div className="flex flex-col text-[#ccc]">
                        <ArrowDownUp className="w-3 h-3" strokeWidth={3} />
                      </div>
                    </div>
                  </th>
                  <th className="px-2 py-2.5 text-left align-middle font-bold text-[#333] hover:bg-[#f9f9f9] cursor-pointer w-[15%]">
                    <div className="flex items-center justify-between">
                      Aksi
                      <div className="flex flex-col text-[#ccc]">
                        <ArrowDownUp className="w-3 h-3" strokeWidth={3} />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 bg-[#f9f9f9] text-[#333]">No data available in table</td>
                  </tr>
                ) : (
                  paginated.map((u, i) => (
                    <tr key={u.id} className={`${i % 2 !== 0 ? 'bg-[#f9f9f9]' : 'bg-white'} hover:bg-[#f5f5f5] text-[#333] transition-colors border-b border-[#f4f4f4]`}>
                      <td className="px-2 py-[11px] border-r border-[#f4f4f4] text-center align-middle">
                        <input 
                          type="checkbox" 
                          className="rounded-sm border-[#ccc]"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleSelect(u.id)}
                        />
                      </td>
                      <td className="px-2 py-[11px] border-r border-[#f4f4f4] align-middle">
                        {u.name}
                      </td>
                      <td className="px-2 py-[11px] border-r border-[#f4f4f4] align-middle">
                        {u.email}
                      </td>
                      <td className="px-2 py-[11px] align-middle">
                        <div className="flex items-center gap-[5px] text-[#007bff]">
                          <Link to={`/admin/users/${u.id}`} className="hover:text-[#0056b3] transition-colors p-[2px]" title="Detail">
                            <IdCard className="w-[15px] h-[15px]" strokeWidth={2.5} />
                          </Link>
                          <button className="hover:text-[#0056b3] transition-colors p-[2px]" title="View">
                            <Search className="w-[15px] h-[15px]" strokeWidth={2.5} />
                          </button>
                          {!isReadOnly && (
                            <>
                              <button className="hover:text-[#0056b3] transition-colors p-[2px]" title="Edit">
                                <Edit className="w-[15px] h-[15px]" strokeWidth={2.5} />
                              </button>
                              <button className="hover:text-[#0056b3] transition-colors p-[2px]" title="Delete">
                                <Trash2 className="w-[15px] h-[15px]" strokeWidth={2.5} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="px-4 pb-4 pt-1 flex flex-col sm:flex-row justify-between items-center gap-4 text-[15px]">
            <div className="text-[#333]">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className={`px-[12px] py-[5px] border border-[#ddd] rounded-l-[3px] bg-[#fafafa] ${currentPage === 1 ? 'text-[#777] cursor-not-allowed' : 'text-[#337ab7] hover:bg-[#eee]'}`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)} 
                  className={`px-[12px] py-[5px] border-y border-r border-[#ddd] ${currentPage === i + 1 ? "bg-[#337ab7] text-white" : "bg-white text-[#337ab7] hover:bg-[#eee]"}`} 
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages || totalPages === 0} 
                className={`px-[12px] py-[5px] border-y border-r border-[#ddd] rounded-r-[3px] bg-white ${currentPage === totalPages || totalPages === 0 ? 'text-[#777] cursor-not-allowed' : 'text-[#337ab7] hover:bg-[#eee]'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, isOpen: false }))} />
    </PageWrapper>
  );
}
