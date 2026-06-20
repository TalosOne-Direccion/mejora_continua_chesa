import React, { useEffect } from 'react';
import { Modo } from '../types';

interface ActaLeanModalProps {
  modo: Modo;
  onClose: () => void;
}

export const ActaLeanModal: React.FC<ActaLeanModalProps> = ({ modo, onClose }) => {
  const data = modo.phases[1]?.data || {};
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-acta, #printable-acta * {
            visibility: visible;
          }
          #printable-acta {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:absolute print:inset-0 print:p-0 print:bg-white print:items-start print:justify-start">
        <div className="bg-white rounded-2xl w-full max-w-[900px] h-[90vh] flex flex-col shadow-2xl relative overflow-hidden print:w-full print:h-auto print:shadow-none print:rounded-none print:overflow-visible print:static">
        
        {/* Header Actions - hidden in print */}
        <div className="absolute top-0 right-0 p-4 flex gap-2 z-10 print:hidden bg-gradient-to-b from-white/90 to-transparent w-full justify-end pb-8">
          <button onClick={handlePrint} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[18px]">print</span> Imprimir
          </button>
          <button onClick={onClose} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span> Cerrar
          </button>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-12 pt-20 print:block print:overflow-visible print:p-8 print:pt-8" id="printable-acta">
          <table className="w-full border-collapse border border-slate-900 mb-8 text-slate-900">
            <tbody>
              <tr>
                <td className="border border-slate-900 p-4 text-center font-bold text-[13px] w-[20%]">
                  <img src="/logo_chesa.png" alt="Grupo Chesa" className="w-24 mx-auto mb-2" />
                  MEJORA CONTINUA
                </td>
                <td className="border border-slate-900 p-4 text-center font-bold text-[16px] w-[60%] tracking-wide uppercase">
                  {modo.projectType === 'Reingeniería' 
                    ? 'MC-FO-RE ACTA DE REINGENIERÍA' 
                    : modo.projectType === 'Taller de Herramientas'
                      ? 'MC-FO-TH ACTA DEL TALLER DE HERRAMIENTAS'
                      : 'MC-FO-AL ACTA LEAN PROJECT'} ({data.nombreProyecto || modo.name})
                </td>
                <td className="border border-slate-900 p-2 text-left text-[11px] w-[20%]">
                  <div>Código: {modo.projectType === 'Reingeniería' ? 'MC-FO-RE' : modo.projectType === 'Taller de Herramientas' ? 'MC-FO-TH' : 'MC-FO-AL'}</div>
                  <div>Versión: 1.0</div>
                  <div>Vigencia: 18/06/2027</div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="border border-slate-900 p-0">
                  <table className="w-full text-[12px]">
                    <tbody>
                      <tr>
                        <td className="border-r border-slate-900 p-2 w-1/3">Responsable: <span className="font-bold">{data.equipo?.lider || '-'}</span></td>
                        <td className="border-r border-slate-900 p-2 w-1/3">Aprobador: <span className="font-bold">{data.equipo?.patrocinador || '-'}</span></td>
                        <td className="p-2 w-1/3">Próxima revisión: <span className="font-bold">18/12/2026</span></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="space-y-6 text-[14px]">
            <div>
              <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[13px]">Nombre del Proyecto</h3>
              <p className="text-slate-800">{data.nombreProyecto || modo.name}</p>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[13px]">Problema</h3>
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{data.problema || '-'}</p>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[13px]">Objetivo General</h3>
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{data.objetivoGeneral || '-'}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[13px]">Alcance</h3>
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{data.alcance || '-'}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[13px]">Fuera de Alcance</h3>
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{data.fueraDeAlcance || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[13px]">Obstáculos Operativos</h3>
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{data.obstaculosOperativos || '-'}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[13px]">Beneficios Esperados</h3>
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{data.beneficiosEsperados || data.beneficioEsperado || '-'}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[13px]">Equipo del {modo.projectType === 'Reingeniería' ? 'Proyecto' : modo.projectType === 'Taller de Herramientas' ? 'Taller' : 'MODO'}</h3>
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3 border-r border-slate-200 w-[40%]">Rol</th>
                    <th className="p-3">Nombre</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-slate-800">
                  <tr className="border-b border-slate-200"><td className="p-3 border-r border-slate-200 font-medium">Patrocinador</td><td className="p-3">{data.equipo?.patrocinador || '-'}</td></tr>
                  <tr className="border-b border-slate-200"><td className="p-3 border-r border-slate-200 font-medium">Dueño del proceso</td><td className="p-3">{data.equipo?.duenoProceso || '-'}</td></tr>
                  <tr className="border-b border-slate-200"><td className="p-3 border-r border-slate-200 font-medium">Líder del proyecto</td><td className="p-3">{data.equipo?.lider || '-'}</td></tr>
                  <tr className="border-b border-slate-200"><td className="p-3 border-r border-slate-200 font-medium">Usuarios clave</td><td className="p-3">{data.equipo?.usuariosClave || '-'}</td></tr>
                </tbody>
              </table>
            </div>

            {data.kpisPreliminares && (
              <div className="border-t border-slate-200 pt-4 mt-8">
                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[13px]">KPIs Preliminares</h3>
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{data.kpisPreliminares}</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
