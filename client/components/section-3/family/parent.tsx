import { FamilyDto } from "@/types/member";
import MemberCard from "../../member";

type ParentType = {
  data: FamilyDto;
  handleChildren: (data: any) => void;
};

const Parent = ({ data, handleChildren }: ParentType) => {
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
          handleChildren={handleChildren}
          selected
          hiddenBtnAdd
        />
      </div>
      {!!data?.wife && !!data?.husband && (
        <div className="sticky">
          <MemberCard
            data={data}
            title="wife"
            handleChildren={handleChildren}
            hiddenBtnAdd
          />
        </div>
      )}
      {!!data?.exWife && (
        <div className="sticky">
          <MemberCard
            data={data}
            title="exWife"
            handleChildren={handleChildren}
            hiddenBtnAdd
          />
        </div>
      )}
    </div>
  );
};

export default Parent;
