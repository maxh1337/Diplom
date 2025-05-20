import Select from "react-select";
import type { Category } from "../../features/home/components/ContrinueRegistrationForm";

const categories: Category[] = [
  { value: "SchoolBefore9", label: "Школа до 9 класса" },
  { value: "SchoolFrom9to11", label: "Школа 9-11 класс" },
  { value: "Student", label: "Студент" },
];

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#000000" : "#1B1B1E",
    padding: "0.63rem",
    fontFamily: "Unbounded Variable, sans-serif",
    fontWeight: "200",
    color: "#FFFFFF",
    borderWidth: "2px",
    borderColor: state.isFocused ? "#FFFFFF" : "#000000",
    borderRadius: "0.5rem",
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: "none",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#FFFFFF",
    fontFamily: "Unbounded Variable, sans-serif",
    fontWeight: "200",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#1B1B1E",
    zIndex: 10,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#6a7282" : "#1B1B1E",
    color: "#FFFFFF",
    fontFamily: "Unbounded Variable, sans-serif",
    fontWeight: "200",
    cursor: "pointer",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#6a7282",
    fontFamily: "Geist Sans, sans-serif",
    fontWeight: "200",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#6a7282",
    "&:hover": {
      color: "#D1D5DB",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

interface ReactSelectProps {
  category: Category;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
}

export default function ReactSelect(props: ReactSelectProps) {
  const handleChange = (selected: any) => {
    props.setCategory(selected);
  };

  return (
    <>
      <label
        htmlFor="category"
        className="mb-2 text-sm font-brains-mono font-bold"
      >
        Выберите категорию
      </label>
      <Select
        options={categories}
        value={props.category}
        onChange={handleChange}
        styles={customStyles}
        placeholder="Выберите..."
        isSearchable={false}
        className="font-brains-mono"
        classNamePrefix="react-select"
        required
      />
    </>
  );
}
