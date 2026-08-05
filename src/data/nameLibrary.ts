// Suggestion library. Baby names reflect recent top UK names (ONS England &
// Wales), mixed with a generous helping of comedy names for good measure.

export interface SuggestionGroup {
  id: string;
  label: string;
  emoji: string;
  names: string[];
}

const GIRLS = [
  "Olivia", "Amelia", "Isla", "Lily", "Freya", "Ivy", "Florence", "Ava",
  "Willow", "Mia", "Elsie", "Evie", "Isabella", "Sophia", "Grace", "Poppy",
  "Rosie", "Ada", "Sofia", "Maya", "Daisy", "Phoebe", "Sienna", "Aria",
  "Bonnie", "Millie", "Emily", "Charlotte", "Ella", "Harper", "Matilda",
  "Penelope", "Ruby", "Hallie", "Luna", "Delilah", "Margot", "Maisie", "Nova",
  "Eleanor", "Emilia", "Layla", "Aurora", "Violet", "Mila", "Molly", "Thea",
  "Hazel",
  // comedy
  "Chardonnay", "Khaleesi", "Beyoncé", "Moon Unit", "Sazzletits",
];

const BOYS = [
  "Muhammad", "Noah", "Oliver", "Arthur", "Leo", "George", "Theodore", "Theo",
  "Freddie", "Archie", "Oscar", "Henry", "Jack", "Charlie", "Teddy", "Harry",
  "Jude", "Alfie", "Finley", "Thomas", "Rory", "William", "Tommy", "Roman",
  "Isaac", "Hudson", "Reggie", "Elijah", "Louie", "Albie", "Ronnie", "James",
  "Sonny", "Jaxon", "Arlo", "Ethan", "Lucas", "Joshua", "Hugo", "Grayson",
  "Alexander", "Reuben", "Frankie", "Sebastian", "Edward", "Max", "Mason",
  "Dylan",
  // comedy
  "Blazer", "Æ A-Xii", "BabyMcBabyFace", "Count Binface", "Harry Kane",
  "Toni Blair", "Sir Loin", "Gandalf", "Sausage", "Kevin", "Barry", "Gary",
  "Draco", "Anakin", "Elvis", "Chad", "Nigel", "Dwayne", "Voldemort", "Kanye",
  "Big Chungus", "Bark Twain", "Sir Reginald Fluffybottom",
];

const PETS = [
  "Bella", "Luna", "Max", "Charlie", "Milo", "Cooper", "Buddy", "Daisy",
  "Rocky", "Bailey", "Lola", "Teddy", "Coco", "Ruby", "Oscar", "Simba", "Bear",
  "Poppy", "Ziggy", "Nala", "Biscuit", "Peanut", "Waffles", "Pickle", "Noodle",
  "Meatball", "Mr Whiskers", "Fluffy", "Gizmo", "Pumpkin", "Marshmallow", "Taco",
  "Mochi", "Pepper", "Shadow", "Ghost", "Loki", "Thor", "Zeus", "Athena",
  "Winston", "Bagel",
  // comedy
  "Cottage", "Beans", "Nugget", "Hashtag", "Danger", "Rocket", "Chairman Meow",
  "Pilot Inspektor",
];

export const SUGGESTION_GROUPS: SuggestionGroup[] = [
  { id: "girls", label: "Girls", emoji: "👧", names: GIRLS },
  { id: "boys", label: "Boys", emoji: "👦", names: BOYS },
  { id: "pets", label: "Pets", emoji: "🐾", names: PETS },
];
