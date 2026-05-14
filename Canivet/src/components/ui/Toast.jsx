export const Toast = ({ toast }) =>
  toast ? (
    <div className={`toast ${toast.ok ? 'toast-ok' : 'toast-err'}`}>
      {toast.ok ? 'OK:' : 'Error:'} {toast.msg}
    </div>
  ) : null
