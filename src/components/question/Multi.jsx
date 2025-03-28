import { Checkbox, FormControlLabel } from "@mui/material";

function Multi({ question, handleMultiChange, answer }) {
    const filteredAnswer = answer.filter((item) => item.question === question.id);
    const selectedOptions = JSON.parse(filteredAnswer[0]?.answer_text || []);

    return (
        <>
            {question.choices?.map((option, index) => (
                <FormControlLabel
                sx={{
                    backgroundColor: filteredAnswer ? "#f0f0f0" : "transparent",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                    disabled={filteredAnswer.length > 0}
                    key={index}
                    control={
                        <Checkbox
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleMultiChange(question.id, option)}
                        />
                    }
                    label={option}
                />
            ))}
        </>
    );
}

export default Multi;
