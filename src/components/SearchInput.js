import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SearchInput(props) {
  return (
    <section className="mb-10">
      <input
        className="bg-gray-700 w-1/3 p-2 rounded-l-lg focus:outline-none"
        placeholder="探したい曲名を入力してください"
        value={props.keyword}
        onChange={props.onInputChange}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
        onClick={props.onSubmit}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {/* <p>{props.keyword}</p> */}
    </section>
  );
}
