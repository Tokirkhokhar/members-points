import { useState } from "react";
import { getReq } from "@/config/request";

interface Wallet {
  id: string;
  createdAt: string;
  name: string;
  walletCode: string;
  unitSingularName: string;
  unitPluralName: string;
  isDefault: boolean;
}

export const useGetMembersWallets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Wallet[]>([]);

  const getMembersWallets = async () => {
    try {
      setIsLoading(true);

      const { data: response } = await getReq("/member-portal/wallets/list");
      if (response) {
        setIsLoading(false);
        setData(response);
      }
      return response;
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getMembersWallets,
    isLoading,
    data,
    defaultWallet: data?.find(({ isDefault }) => isDefault),
  };
};
