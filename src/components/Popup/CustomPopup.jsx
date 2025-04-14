import CompanySchedule from "./Schedule";
import AnswerBox from "./AnswerBox";
import { GiCancel } from "react-icons/gi";

export default function CustomPopup({ answer, phase, update, handleClose }) {

    const PopupPicker = () => {
        if (!update.id) return null;
    
        if (answer)
          return (
            <AnswerBox
              applicant={update}
              phase={phase}
              next={handleNext}
              fail={handleFail}
            />
          );
          console.log(update);
        return (
          <CompanySchedule
            applicant={update}
            phase={phase}
            handleClose={handleClose}
          />
        );
      };
    
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ zIndex: 99 }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"
        style={{ backdropFilter: "blur(10px)" }}
      ></div>
      <div
        className="position-relative bg-white p-4 rounded-4 shadow-lg"
        style={{
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
          backdropFilter: "blur(5px)",
        }}
      >
        <h2 className="text-center mb-3">
          {answer
            ? `${update.user_name} Answers`
            : Number(phase) === 2
            ? "Assessment Link"
            : "Set Schedule"}
        </h2>
        <GiCancel
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            scale: 2,
            cursor: "pointer",
            color: "red",
          }}
          onClick={handleClose}
        />
        <PopupPicker />
      </div>
    </div>
  );
}
