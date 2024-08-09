import Image from "next/image";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

type MemberCardType = {
  title?: "husband" | "wife" | "exWife";
  data: any;
  handleChildren?: (data: any) => void | undefined;
  selected?: boolean;
  isFamily?: boolean;
};

const MemberCard = ({
  data,
  handleChildren,
  title,
  selected = false,
  isFamily = false,
}: MemberCardType) => {
  return (
    <div className="member-card">
      {((!!title && data?.[title]?.tag) || data?.tag) && (
        <div className="tag">
          {isFamily && !!title ? data?.[title]?.tag : data?.tag}
        </div>
      )}
      <div className="avatar">
        <Image
          src={isFamily && title ? data?.[title]?.image : data?.image}
          alt={isFamily && title ? data?.[title]?.name : data?.name}
          fill
        />
      </div>
      <div className={"information" + (selected ? " selected" : "")}>
        <div className="full-name">
          <strong>
            {isFamily && title ? data?.[title]?.name : data?.name}
          </strong>
        </div>
        <div className="date">
          {isFamily && title ? data?.[title]?.date : data?.date}
        </div>
      </div>
      {!!handleChildren && (
        <button
          className="btn-add"
          onClick={() => {
            handleChildren(data);
          }}
        >
          <AccountTreeIcon sx={{ color: "rgb(171, 35, 17)" }} />
        </button>
      )}
    </div>
  );
};

export default MemberCard;
