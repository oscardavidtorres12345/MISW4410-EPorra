import Swal from "sweetalert2";

export function showAlert(options) {
  return Swal.fire({
    background: "#181818",
    color: "#fff",
    confirmButtonColor: "#ccf546",
    customClass: {
      confirmButton: "custom-btn custom-btn-primary  btn btn-primary",
    },
    ...options,
  });
}
