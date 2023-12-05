import axios from "axios";
import { School } from "./school.js";

export class Client {
  async search(token, params) {
    const response = await this.#sendGetRequest(token, params);
    const total = response.data.schools.total;
    const schoolsData = response.data.schools.data;
    const schools = schoolsData.map(
      (school) =>
        new School(
          school.school_name,
          school.school_founder,
          school.school_type,
          school.zip_code,
          school.school_locate_at
        )
    );
    return { total: total, schools: schools };
  }

  #sendGetRequest(token, params) {
    const url = "https://api.edu-data.jp/api/v1/school";
    return axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });
  }
}
