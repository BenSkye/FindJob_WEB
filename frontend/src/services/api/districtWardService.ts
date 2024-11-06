import axios from "axios";


export const fetchDataEsgoo = async (url: string) => {
  try {
    const response = await axios.get(url);
    if (response.data.error === 0) {
      return response.data.data;
    } else {
      console.error("Error fetching data:", response.data.error_text);
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
  return [];
};

export const fetchProvinces = () => {
  return fetchDataEsgoo(`https://esgoo.net/api-tinhthanh/1/0.htm`);
};

export const fetchDistricts = (provinceId: string) => {
  return fetchDataEsgoo(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
};

export const fetchWards = (districtId: string) => {
  return fetchDataEsgoo(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
};