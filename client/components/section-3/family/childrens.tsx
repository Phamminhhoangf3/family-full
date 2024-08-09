import { ChildrenDto, FamilyDto } from "@/types/member";
import MemberCard from "../../member";
import { groupByThree } from "@/utils";

type ChildrenType = {
  data: FamilyDto;
  handleChildren: (data: any) => void;
};

const Childrens = ({ data, handleChildren }: ChildrenType) => {
  const groupChildren = !!data?.children?.length
    ? groupByThree(data?.children)
    : [];

  return (
    <>
      {groupChildren.map((listChildren, index) => (
        <ul className={index !== 0 ? "row-three" : ""} key={index}>
          <div className="row">
            {!!listChildren?.length &&
              listChildren.map((child, i) => (
                <li className={i === 0 ? "first" : "not-first"} key={child?.id}>
                  <div className={"sticky children" + (i == 0 ? " next" : "")}>
                    <MemberCard data={child} handleChildren={handleChildren} />
                  </div>
                </li>
              ))}
          </div>
        </ul>
      ))}
    </>
  );
};

export default Childrens;
