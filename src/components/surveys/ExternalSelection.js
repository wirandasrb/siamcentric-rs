import { Autocomplete, Box, TextField } from "@mui/material"
import useApi from "../../services";
import React from "react";

const ExternalSelection = ({ source_id, value, onChange, primaryColor,
    ...props
}) => {
    const [options, setOptions] = React.useState([]);

    React.useEffect(() => {
        fetchOptions();
    }, [source_id]);

    const fetchOptions = async () => {
        try {
            const response = await useApi.external.getExternalOptions(source_id);
            console.log("Fetched external options:", response);
            setOptions(response);
        } catch (error) {
            console.error("Failed to fetch external options:", error);
        }
    };

    return (
        <Autocomplete
            {...props}
            options={options}
            getOptionLabel={(option) => option.option}
            value={options.find(opt => opt.option === value) || null}
            onChange={(event, newValue) => {
                onChange(newValue ? newValue.option : "");
            }}
            sx={{
                mt: 1.5,
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5, // ความโค้งมนเท่ากับ TextField และปุ่ม
                    backgroundColor: "#fcfcfc",
                    "& fieldset": {
                        borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                        borderColor: primaryColor,
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: primaryColor,
                    },
                },
            }}
            renderInput={(params) => <TextField
                {...params}
                placeholder="กรุณาเลือกคำตอบ..."
                // label={source_id === 1 ? "จังหวัด" : source_id === 2 ? "อำเภอ" : "Select an option"}
                InputLabelProps={{ shrink: true }}
            />}
        />
    );
}

export default ExternalSelection;