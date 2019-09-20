import { ActionTree } from "vuex";
import jwt_code from "jwt-decode"

const actions: ActionTree<any, any> = {
  async setUser({ state, commit }, user: any) {
    // 解码token以获取用户信息
    const decoded = jwt_code(user);
    commit("SET_USER", decoded);
  }
}

export default actions;