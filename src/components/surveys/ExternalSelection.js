import { Autocomplete, Box, TextField } from "@mui/material"
import useApi from "../../services";
import React from "react";

const ExternalSelection = ({ source_id, value, onChange }) => {
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
            options={options}
            getOptionLabel={(option) => option.option}
            value={options.find(opt => opt.option === value) || null}
            onChange={(event, newValue) => {
                onChange(newValue ? newValue.option : null);
            }}
            renderInput={(params) => <TextField
                {...params}
                placeholder="กรุณาเลือกคำตอบ"
                label={source_id === 1 ? "จังหวัด" : source_id === 2 ? "อำเภอ" : "Select an option"}
                InputLabelProps={{ shrink: true }}
            />}
        />
    );
}

export default ExternalSelection;