export default function generateSlug(title) {
  const slug = title
    .toLowerCase() //Convert the title to lowercase
    .replace(/\s+/g, "-") //Replace spaces with dashes
    .replace(/[^\w\-]+/g, "") //Remove Non-word charachters expect dashes
    .replace(/\-\-+/g, "-") //Replace multiple consecutive dashes with a single dash
    .replace(/^\-+/, "") //Remove dashes from the beginning
    .replace(/\-+$/, ""); //Remove dashes from the end

  return slug;
}
