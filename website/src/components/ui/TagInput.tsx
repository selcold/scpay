import React, { useState, KeyboardEvent } from "react";
import toast from "react-hot-toast";

interface TagInputProps {
  onTagsChange: (tags: string[]) => void;
  initialTags?: string[];
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({
  onTagsChange,
  initialTags = [],
  maxTags = 10,
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState<string>("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && input.trim() !== "") {
      if (tags.includes(input.trim())) {
        toast.error("同じタグは追加できません");
      } else if (tags.length >= maxTags) {
        alert(`タグの上限は ${maxTags} です`);
      } else {
        const newTags = [...tags, input.trim()];
        setTags(newTags);
        onTagsChange(newTags);
        setInput("");
      }
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onTagsChange(newTags);
  };

  return (
    <div className="flex flex-col gap-2 w-full p-2 c-bg c-border rounded-lg">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex gap-1 w-fit text-white bg-blue-600/70 border-blue-600 border rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out"
          >
            <span className="px-3 py-2 text-sm md:text-base">{tag}</span>
            <button
              className="flex justify-center items-center w-10 h-full text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out"
              onClick={() => removeTag(index)}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            tags.length >= maxTags
              ? `タグは最大${maxTags}個です。`
              : "タグを入力してEnterキーを押します"
          }
          className="p-2 bg-transparent rounded-md"
          disabled={tags.length >= maxTags}
        />
      </div>
    </div>
  );
};

export default TagInput;
