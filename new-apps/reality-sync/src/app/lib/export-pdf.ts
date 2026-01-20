// Reality Sync - PDF Export Utility

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Vault, Asset, Room } from '../types';

export const generateInsuranceClaimPDF = (
  vault: Vault,
  assets: Asset[],
  rooms: Room[],
  dateRange: { start: string; end: string }
): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cover Page
  doc.setFontSize(24);
  doc.text('Insurance Claim Packet', pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Property: ${vault.name}`, 20, 60);
  if (vault.address) {
    doc.text(`Address: ${vault.address}`, 20, 70);
  }
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 80);
  doc.text(`Period: ${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`, 20, 90);
  
  // Room Summary
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Room Summary', 20, 20);
  
  const roomData = rooms.map(room => {
    const roomAssets = assets.filter(a => a.roomId === room.id);
    return [room.name, roomAssets.length.toString()];
  });
  
  autoTable(doc, {
    startY: 30,
    head: [['Room Name', 'Assets']],
    body: roomData,
  });
  
  // Asset Register
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Asset Register', 20, 20);
  
  const assetData = assets.map(asset => {
    const room = rooms.find(r => r.id === asset.roomId);
    return [
      asset.name,
      asset.category,
      room?.name || 'Unknown',
      asset.valueRange.toUpperCase(),
      asset.condition,
      asset.photos.length > 0 ? 'Yes' : 'No',
    ];
  });
  
  autoTable(doc, {
    startY: 30,
    head: [['Item', 'Category', 'Room', 'Value Range', 'Condition', 'Evidence']],
    body: assetData,
    styles: { fontSize: 8 },
  });
  
  // Disclaimer
  const finalY = (doc as any).lastAutoTable.finalY || 30;
  doc.setFontSize(10);
  doc.text('Disclaimer: Value estimates are approximate. Verify with your insurer.', 20, finalY + 20);
  doc.text('All timestamps and integrity hashes are for reference only.', 20, finalY + 30);
  
  return doc;
};

export const generateCSV = (assets: Asset[], rooms: Room[]): string => {
  const headers = [
    'vault_id',
    'room',
    'asset_name',
    'category',
    'value_low',
    'value_high',
    'serial',
    'proof_files',
    'created_at',
  ];
  
  const rows = assets.map(asset => {
    const room = rooms.find(r => r.id === asset.roomId);
    return [
      asset.vaultId,
      room?.name || '',
      asset.name,
      asset.category,
      asset.valueRange,
      asset.valueRange,
      asset.serialNumber || '',
      asset.photos.length.toString(),
      asset.createdAt,
    ];
  });
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};
