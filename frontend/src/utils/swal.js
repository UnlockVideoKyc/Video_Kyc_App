import Swal from "sweetalert2";

export const swalSuccess = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#3085d6",
  });

export const swalError = (title, text) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#d33",
  });

export const swalWarning = (title, text) =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#f0ad4e",
  });

export const swalConfirm = ({ title, text, onConfirm }) => {
  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) onConfirm();
  });
};
