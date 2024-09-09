import Image from "next/image";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import dayjs from "dayjs";

type MemberCardType = {
  title?: "husband" | "wife" | "exWife"; // nếu có title là family, ngược lại là children
  data: any;
  handleChildren?: (data: any) => void | undefined;
  selected?: boolean;
};

const MemberCard = ({
  data,
  handleChildren,
  title,
  selected = false,
}: MemberCardType) => {
  const renderTextWithField = (field: "tag" | "image" | "name" | "dob") => {
    if (!data) return null;
    const selectedValue = !!title ? data?.[title] : data;
    if (field === "dob") {
      let textDob = "";
      if (selectedValue?.fromDob)
        textDob += dayjs(selectedValue?.fromDob).format("YYYY");
      if (selectedValue?.toDob)
        textDob += ` - ${dayjs(selectedValue?.toDob).format("YYYY")}`;
      return textDob;
    }
    return selectedValue?.[field];
  };

  return (
    <div className="member-card">
      {((!!title && data?.[title]?.tag) || data?.tag) && (
        <div className="tag">{renderTextWithField("tag")}</div>
      )}
      <div className="avatar">
        <Image
          src={renderTextWithField("image")}
          alt={renderTextWithField("name")}
          fill
        />
      </div>
      <div className={"information" + (selected ? " selected" : "")}>
        <div className="full-name">
          <strong>{renderTextWithField("name")}</strong>
        </div>
        <div className="date">{renderTextWithField("dob")}</div>
      </div>
      {!!handleChildren && !!data?.familyId && (
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
