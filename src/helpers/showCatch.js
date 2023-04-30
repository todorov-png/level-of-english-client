export function showCatchMessage(e) {
  let messageError = this.$t('TOAST.DETAIL.SERVER_ERROR');
  if (e.response?.data?.message) {
    messageError = e.response.data.message;
  }
  this.$toast.add({
    severity: 'error',
    summary: this.$t('TOAST.SUMMARY.ERROR'),
    detail: messageError,
    life: 3000,
  });
}
