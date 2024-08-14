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
        <MemberCard data={data} title="husband" selected />
      </div>
      {!!data?.wife && !!data?.husband && (
        <div className="sticky">
          <MemberCard data={data} title="wife" />
        </div>
      )}
      {!!data?.exWife && (
        <div className="sticky">
          <MemberCard data={data} title="exWife" />
        </div>
      )}
    </div>
  );
};

export default Parent;
