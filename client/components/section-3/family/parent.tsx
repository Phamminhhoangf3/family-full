import { FamilyDto } from "@/types/member";
import MemberCard from "../../member";

type ParentType = {
  data: FamilyDto;
};

const Parent = ({ data }: ParentType) => {
  const renderClass = (family: FamilyDto) => {
    let result = ["sticky"];
    if (family?.husband && family?.wife) result.push("line");
    if (!!family?.children?.length) result.push("parent");
    return result.join(" ");
  };

  return (
    <div className="row">
      <div className={renderClass(data)}>
        <MemberCard
          data={data}
          title={!!data?.husband ? "husband" : "wife"}
          selected
          isFamily
        />
      </div>
      {!!data?.wife && !!data?.husband && (
        <div className="sticky">
          <MemberCard data={data} title="wife" isFamily />
        </div>
      )}
      {!!data?.exWife && (
        <div className="sticky">
          <MemberCard data={data} title="exWife" isFamily />
        </div>
      )}
    </div>
  );
};

export default Parent;
