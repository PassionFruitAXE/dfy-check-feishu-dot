import axios from "axios";
import { TBaseResponse, TCheckStatus } from "../../types/response";
import { PREFIX } from "../../config";

export function check(checkincode: string) {
  return axios.get<TBaseResponse<TCheckStatus[]>>(
    `${PREFIX}/duifene/check/${checkincode}`,
  );
}
