import axios from "axios";
import { School } from "./school.js";

export class ApiClient {
  constructor(token, params) {
    this.token = token;
    this.params = params;
  }

  async search() {
    const response = await this.#sendGetRequest();
    const total = response.data.schools.total;
    const schoolsData = response.data.schools.data;
    const schools = schoolsData.map(
      (data) =>
        new School(
          data.school_name,
          data.school_founder,
          data.school_type,
          data.zip_code,
          data.school_locate_at
        )
    );
    return { total: total, schools: schools };
  }

  #sendGetRequest() {
    const url = "https://api.edu-data.jp/api/v1/school";
    return axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: this.params,
    });
  }
}
