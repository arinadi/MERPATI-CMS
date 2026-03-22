import Link from "next/link";
import { Search, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#0B1120]">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <div className="mb-8">
                    <span className="text-[120px] md:text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 drop-shadow-xl select-none">
                        404
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Halaman Tidak Ditemukan</h1>
                
                <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
                    Maaf, artikel atau halaman yang Anda cari mungkin telah dipindahkan atau tidak pernah ada.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link 
                        href="/" 
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide transition-all shadow-lg shadow-blue-900/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/40"
                    >
                        <Home className="w-5 h-5" />
                        Kembali ke Beranda
                    </Link>
                    
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Cari konten lain..." 
                            className="w-full bg-[#1E293B] border border-white/10 rounded-full py-4 pl-12 pr-12 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
