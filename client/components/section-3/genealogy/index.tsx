import { FamilyDto } from "@/types/member";
import { useEffect, useState } from "react";
import Family from "../family";
import { useMutation } from "@tanstack/react-query";
import { getDetailFamily } from "@/apis";
const Genealogy = () => {
  const familyIdFirst = process.env.NEXT_PUBLIC_FAMILY_ID_FIRST;
  const [state, setState] = useState<FamilyDto[]>([]);
  const [valueMember, setValueMember] = useState({
    familyId: familyIdFirst,
    dad: "",
  });
  const { familyId, dad } = valueMember;

  const { mutate } = useMutation({
    mutationFn: async (params: any) => await getDetailFamily(params),
    onSuccess: (data) => {
      if (data) setState((prev) => [...prev, data]);
    },
  });

  const handleAppendFamily = (data: any) => {
    if (data?.familyId !== familyId && data.dad !== dad)
      setValueMember({ familyId: data?.familyId, dad: data?.dad });
  };

  useEffect(() => {
    if (familyId) mutate({ id: familyId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyId]);

  return (
    <div>
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
    </div>
  );
};

export default Genealogy;
