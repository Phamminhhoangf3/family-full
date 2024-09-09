import { FamilyDto, RequestDto } from "@/types/member";
import { useEffect, useState } from "react";
import Family from "../family";
import { useMutation } from "@tanstack/react-query";
import { getListFamily } from "@/apis";
import { ListFamilyType } from "@/types/family";
const Genealogy = () => {
  const familyIdFirst = process.env.NEXT_PUBLIC_FAMILY_ID_FIRST;
  const [state, setState] = useState<FamilyDto[]>([]);
  const [valueMember, setValueMember] = useState({
    familyId: familyIdFirst,
    dad: "",
  });
  const { familyId, dad } = valueMember;

  const { mutate } = useMutation({
    mutationFn: async (params: ListFamilyType) => await getListFamily(params),
    onSuccess: (data) => {
      if (data?.length) setState(data);
    },
  });

  const handleAppendFamily = (params: any) => {
    if (!params?.familyId) return;
    // index của request trùng dadId
    const indexRequest = request.findIndex(
      (item) => item.dadId === params.dadId
    );
    let newRequest;
    // nếu cùng cha thì khi chọn sẽ thay thế nhau
    if (indexRequest >= 0) {
      newRequest = [
        ...request.slice(0, indexRequest),
        { familyId: params.familyId, dadId: params.dadId },
      ];
    } else {
      newRequest = [
        ...request,
        { familyId: params.familyId, dadId: params.dadId },
      ];
    }
    setRequest(newRequest);
  };

  useEffect(() => {
    mutate({ ids: request.map((item) => item.familyId) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  return (
    <ul className="tree">
      {!!state?.length &&
        state.map((item, index) => (
          <Family
            data={item}
            key={index}
            handleChildren={handleAppendFamily}
            index={index}
          />
        ))}
    </ul>
  );
};

export default Genealogy;
