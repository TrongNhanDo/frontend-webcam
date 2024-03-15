export const dummyDepartment = [
  {
    departmentId: 1,
    departmentName: "Department 1",
  },
  {
    departmentId: 2,
    departmentName: "Department 2",
  },
  {
    departmentId: 3,
    departmentName: "Department 3",
  },
  {
    departmentId: 4,
    departmentName: "Department 4",
  },
  {
    departmentId: 5,
    departmentName: "Department 5",
  },
  {
    departmentId: 6,
    departmentName: "Department 6",
  },
];

export const notFaultImg =
  "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg";

export const hostSocket =
  process.env.REACT_APP_ENV === "local"
    ? "https://840c-14-241-227-126.ngrok-free.app"
    : "https://backend-webcam.onrender.com/";

export const socketHeader = {
  extraHeaders: {
    "ngrok-skip-browser-warning": "69420",
  },
};
