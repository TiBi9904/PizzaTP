import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from "../provider/GlobalProvider";

const AddAddress = ({ close }) => {
  const { register, handleSubmit, setValue, reset } = useForm();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const { fetchAddress } = useGlobalContext();


  // API ESGOO
  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => setProvinces(res.data.data))
      .catch((err) => console.log( err));
  }, []);

  useEffect(() => {
    if (!selectedProvinceId) return;
    axios
      .get(`https://esgoo.net/api-tinhthanh/2/${selectedProvinceId}.htm`)
      .then((res) => setDistricts(res.data.data))
      .catch((err) => console.log( err));
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!selectedDistrictId) return;
    axios
      .get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrictId}.htm`)
      .then((res) => setWards(res.data.data))
      .catch((err) => console.log(err));
  }, [selectedDistrictId]);

  const onSubmit = async (data) => {

    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          user: data.user,
          label: data.label,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          street: data.street,
          ward: data.ward,
          district: data.district,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
          isDefault: data.isDefault,
          notes: data.notes,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

return (
  <section className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4">
    <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Thêm địa chỉ mới
        </h2>

        <button
          onClick={close}
          className="p-1 rounded-full hover:bg-gray-100 transition"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto px-4 sm:px-6 py-5 scrollBarCustom">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Thông tin người nhận */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Họ và tên
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...register("fullName", { required: true })}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Số điện thoại
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...register("phoneNumber", { required: true })}
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block mb-1 font-medium">
              Số nhà, đường
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("street", { required: true })}
            />
          </div>

          {/* Tỉnh - Huyện */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Thành phố / Tỉnh
              </label>

              <select
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...register("city", { required: true })}
                onChange={(e) => {
                  const provinceName = e.target.value;
                  const province = provinces.find(
                    (p) => p.name === provinceName
                  );

                  setValue("city", provinceName);
                  setSelectedProvinceId(province.id);
                  setDistricts([]);
                  setWards([]);
                }}
              >
                <option value="">Chọn tỉnh</option>

                {provinces.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Quận / Huyện
              </label>

              <select
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...register("district", { required: true })}
                disabled={districts.length === 0}
                onChange={(e) => {
                  const districtName = e.target.value;
                  const district = districts.find(
                    (d) => d.name === districtName
                  );

                  setValue("district", districtName);
                  setSelectedDistrictId(district.id);
                  setWards([]);
                }}
              >
                <option value="">
                  Chọn quận/huyện
                </option>

                {districts.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phường - Mã bưu chính */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Phường / Xã
              </label>

              <select
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...register("ward", { required: true })}
                disabled={wards.length === 0}
                onChange={(e) =>
                  setValue("ward", e.target.value)
                }
              >
                <option value="">
                  Chọn phường/xã
                </option>

                {wards.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Mã bưu chính
              </label>

              <input
                type="text"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...register("postalCode", {
                  required: true,
                })}
              />
            </div>
          </div>

          {/* Quốc gia - Loại địa chỉ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Quốc gia
              </label>

              <input
                type="text"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...register("country")}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Loại địa chỉ
              </label>

              <select
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...register("label")}
              >
                <option value="Home">
                  Nhà riêng
                </option>
                <option value="Work">
                  Cơ quan
                </option>
                <option value="Other">
                  Khác
                </option>
              </select>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block mb-1 font-medium">
              Ghi chú
            </label>

            <textarea
              rows={3}
              className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("notes")}
            />
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t p-4 sm:p-5">
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="w-full py-3 rounded-xl bg-primary-100 text-white font-semibold hover:bg-primary-200 transition"
        >
          Xác nhận địa chỉ
        </button>
      </div>
    </div>
  </section>
);
};

export default AddAddress;


// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import AxiosToastError from "../utils/AxiosToastError";
// import Axios from "../utils/AxiosUser";
// import SummaryApi from "../common/SummaryApi";
// import toast from "react-hot-toast";
// import { IoClose } from "react-icons/io5";
// import { useGlobalContext } from "../provider/GlobalProvider";

// const AddAddress = ({ close }) => {
//   const { register, handleSubmit, setValue, reset } = useForm();

//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);

//   const [selectedProvinceId, setSelectedProvinceId] = useState(null);
//   const [selectedProvinceCode, setSelectedProvinceCode] = useState(null);
//   const { fetchAddress } = useGlobalContext();


//   // API ESGOO
// useEffect(() => {
//   axios
//     .get("https://provinces.open-api.vn/api/v2/p/")
//     .then((res) => setProvinces(res.data))
//     .catch(console.error);
// }, []);

// useEffect(() => {
//   if (!selectedProvinceCode) return;

//   axios
//     .get(
//       `https://provinces.open-api.vn/api/v2/p/${selectedProvinceCode}?depth=2`
//     )
//     .then((res) => setWards(res.data.wards))
//     .catch(console.error);
// }, [selectedProvinceCode]);

//   const onSubmit = async (data) => {

//     try {
//       const response = await Axios({
//         ...SummaryApi.createAddress,
//         data: {
//           user: data.user,
//           label: data.label,
//           fullName: data.fullName,
//           phoneNumber: data.phoneNumber,
//           street: data.street,
//           ward: data.ward,
//           district: data.district,
//           city: data.city,
//           country: data.country,
//           postalCode: data.postalCode,
//           isDefault: data.isDefault,
//           notes: data.notes,
//         },
//       });
//       const { data: responseData } = response;

//       if (responseData.success) {
//         toast.success(responseData.message);
//         if (close) {
//           close();
//           reset();
//           fetchAddress();
//         }
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   return (
//     <section className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start sm:items-center overflow-y-auto scrollBarCustom">
//       <div className="bg-white w-full max-w-lg sm:rounded mt-8 sm:mt-16 mx-4 sm:mx-auto p-6 sm:p-8 overflow-y-auto max-h-[86vh] relative scrollBarCustom">

// <div className="-mt-8">
//           <h2 className="fixed z-50 text-xl font-semibold bg-white mb-6 w-[440px]">Thêm địa chỉ mới
//                                                           <button
//           onClick={close}
//           className="absolute top-0.5 right-0 text-gray-500 hover:text-gray-700 transition"
//         >
//           <IoClose size={25} />
//         </button>
//         </h2>
//   </div>

//         <form className="space-y-4 mt-14" onSubmit={handleSubmit(onSubmit)}>
      
//           <div>
//             <label className="block mb-1 font-medium">Họ và tên:</label>
//             <input
//               type="text"
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("fullName", { required: true })}
//             />
//           </div>

 
//           <div>
//             <label className="block mb-1 font-medium">Số điện thoại:</label>
//             <input
//               type="text"
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("phoneNumber", { required: true })}
//             />
//           </div>

  
//           <div>
//             <label className="block mb-1 font-medium">Số nhà, đường:</label>
//             <input
//               type="text"
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("street", { required: true })}
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Mã bưu chính:</label>
//             <input
//               type="text"
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("postalCode", { required: true })}
//             />
//           </div>

 
//           <div>
//             <label className="block mb-1 font-medium">Thành phố / Tỉnh:</label>
//             <select
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("city", { required: true })}
//               onChange={(e) => {
//                 const provinceName = e.target.value;
//                 const province = provinces.find((p) => p.name === provinceName);
//                 setValue("city", provinceName);
//                 setSelectedProvinceId(province.id);
//                 setDistricts([]);
//                 setWards([]);
//               }}
//             >
//               <option value="">Chọn tỉnh</option>
//               {provinces.map((item) => (
//                 <option key={item.id} value={item.name}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>


//           <div>
//             <label className="block mb-1 font-medium">Quận / Huyện:</label>
//             <select
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("district", { required: true })}
//               disabled={districts.length === 0}
//               onChange={(e) => {
//                 const districtName = e.target.value;
//                 const district = districts.find((d) => d.name === districtName);
//                 setValue("district", districtName);
//                 setSelectedProvinceCode(district.id);
//                 setWards([]);
//               }}
//             >
//               <option value="">Chọn quận/huyện</option>
//               {districts.map((item) => (
//                 <option key={item.id} value={item.name}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>


//           <div>
//             <label className="block mb-1 font-medium">Phường / Xã:</label>
//             <select
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("ward", { required: true })}
//               disabled={wards.length === 0}
//               onChange={(e) => setValue("ward", e.target.value)}
//             >
//               <option value="">Chọn phường/xã</option>
//               {wards.map((item) => (
//                 <option key={item.id} value={item.name}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>


//           <div>
//             <label className="block mb-1 font-medium">Quốc gia:</label>
//             <input
//               type="text"
//               defaultValue=""
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("country")}
//             />
//           </div>


//           <div>
//             <label className="block mb-1 font-medium">Ghi chú:</label>
//             <input
//               type="text"
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("notes")}
//             />
//           </div>


//           <div>
//             <label className="block mb-1 font-medium">Loại địa chỉ:</label>
//             <select
//               className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
//               {...register("label")}
//             >
//               <option value="Home">Nhà riêng</option>
//               <option value="Work">Cơ quan</option>
//               <option value="Other">Khác</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="bg-primary-100 text-white w-full py-2 rounded font-semibold hover:bg-primary-200 transition"
//           >
//             Xác nhận
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default AddAddress;
