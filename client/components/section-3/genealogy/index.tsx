import { FamilyDto } from "@/types/member";
import { useEffect, useState } from "react";
import Family from "../family";
import { useMutation } from "@tanstack/react-query";
import { getDetailFamily } from "@/apis";

const Genealogy = () => {
  const [state, setState] = useState<FamilyDto[]>([]);
  const [memberAppend, setMemberAppend] = useState({
    familyId: "66b49cc1d254d4c584172330",
    dadId: "",
  });
  const { familyId, dadId } = memberAppend;
  const { mutate } = useMutation({
    mutationFn: async (params: any) => await getDetailFamily(params),
    onSuccess: (data) => {
      if (data) setState((prev) => [...prev, data]);
    },
  });

  const handleAppendFamily = (data: any) => {
    if (!data.familyId) return;
    if (data?.dadId === dadId) {
      setState([...state.slice(0, -1)]);
    }
    if (data?.familyId !== familyId) {
      setMemberAppend({ familyId: data?.familyId, dadId: data?.dadId });
    }
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
