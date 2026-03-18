import React, { useRef } from 'react';
import { Download, Upload, FileText, Save, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ToolsCard = ({ 
  income, expenses, goals, assets, wishlist, modelName 
}) => {
  const fileInputRef = useRef(null);

  // --- 1. Backup Function (Download JSON) ---
  const handleBackup = () => {
    const data = {
      income, expenses, goals, assets, wishlist, modelName,
      version: "1.0",
      date: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BudgetWise_Backup_${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 2. Restore Function (Load JSON) ---
  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        // Save to specific version key used in App.js
        localStorage.setItem('budgetWise_v8', JSON.stringify(json));
        alert("Data restored successfully! The app will now reload.");
        window.location.reload();
      } catch (err) {
        alert("Invalid Backup File");
      }
    };
    reader.readAsText(file);
  };

  // --- 3. PDF Download Function ---
  const handleDownloadPDF = async () => {
    // Target the HIDDEN Report Template, not the dashboard
    const element = document.getElementById('printable-report'); 
    if (!element) return;
    
    const btn = document.getElementById('pdf-btn');
    const originalText = btn.innerText;
    btn.innerText = "Generating Report...";

    // Capture the hidden element
    const canvas = await html2canvas(element, { 
        scale: 2,
        windowWidth: 1000 // Trick html2canvas into thinking the window is wider
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`WealthOS_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    
    btn.innerText = originalText;
};

  return (
    <div className="card input-card">
      <div className="card-header">
        <Save size={18} className="icon-blue" />
        <h3>System Tools</h3>
      </div>
      <p className="subtext">Manage your data and reports.</p>

      <div className="tools-grid">
        {/* Backup */}
        <button className="tool-btn" onClick={handleBackup}>
          <Download size={16} /> Backup Data
        </button>

        {/* Restore */}
        <button className="tool-btn outline" onClick={() => fileInputRef.current.click()}>
          <Upload size={16} /> Restore Data
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".json" 
          onChange={handleRestore}
        />

        {/* PDF */}
        <button id="pdf-btn" className="tool-btn dark full-width" onClick={handleDownloadPDF}>
          <FileText size={16} /> Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default ToolsCard;