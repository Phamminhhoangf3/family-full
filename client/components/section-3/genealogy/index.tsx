import { FamilyDto, RequestDto } from "@/types/member";
import { useEffect, useState } from "react";
import Family from "../family";
import { useMutation } from "@tanstack/react-query";
import { getDetailFamily } from "@/apis";
import { DetailFamilyType } from "@/types/family";

const Genealogy = () => {
  const familyIdFirst = process.env.NEXT_PUBLIC_FAMILY_ID_FIRST || "";
  const [families, setFamilies] = useState<FamilyDto[]>([]);
  const [request, setRequest] = useState<RequestDto>({
    familyId: familyIdFirst,
    dadId: "",
  });

  const { mutate } = useMutation({
    mutationFn: async (params: DetailFamilyType) =>
      await getDetailFamily(params),
    onSuccess: (data) => {
      if (data) setFamilies((prev) => [...prev, data]);
    },
  });

  const handleAppendFamily = (member: any) => {
    if (!member?.familyId) return;
    // clear last family when with father
    if (request.dadId === member?.dadId) {
      const familiesNew = families.slice(0, families.length - 1);
      setFamilies(familiesNew);
    }
    setRequest({ familyId: member?.familyId, dadId: member?.dadId });
  };

  useEffect(() => {
    mutate({ id: request.familyId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  return (
    <ul className="tree">
      {!!families?.length &&
        families.map((item, index) => (
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
