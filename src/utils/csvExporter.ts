import { Platform, Alert } from 'react-native';
import { Transaction } from '../types';

export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  if (transactions.length === 0) {
    Alert.alert('Thông báo', 'Chưa có giao dịch nào để xuất file.');
    return;
  }

  // Tiêu đề cột
  const headers = ['Mã giao dịch', 'Ngày', 'Loại', 'Số tiền (VND)', 'Danh mục', 'Nguồn tiền', 'Ghi chú'];

  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
    t.amount.toString(),
    `"${t.categoryName.replace(/"/g, '""')}"`,
    `"${(t.walletName || 'Chung').replace(/"/g, '""')}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  // Thêm UTF-8 BOM (\uFEFF) để Excel hiển thị tiếng Việt có dấu chuẩn xác 100%
  const csvContent =
    '\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

  if (Platform.OS === 'web') {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `FinTrack_SaoKe_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Alert.alert('Thành công', 'Đã tải xuống file sao kê Excel (.csv) thành công!');
    } catch (e) {
      console.error(e);
      Alert.alert('Lỗi', 'Không thể tạo file tải về.');
    }
  } else {
    Alert.alert(
      'Sao kê dữ liệu',
      `Đã định dạng thành công ${transactions.length} giao dịch sang chuẩn CSV. Trên bản cài đặt iOS, file sẽ được xuất qua bảng Chia sẻ (Share Sheet).`
    );
  }
};
