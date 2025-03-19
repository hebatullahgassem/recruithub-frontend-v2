import TalentCard from "../../../components/talent/TalentCard";

function Talents() {
  return (
    <>
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: "1rem" }}>Talents</h1>
      </header>
      <TalentCard
      img={"https://media.licdn.com/dms/image/v2/D4D03AQHqq8eu2CgwLw/profile-displayphoto-shrink_400_400/B4DZSOtHXuG4Ak-/0/1737560981521?e=1747872000&v=beta&t=hREPhxuwuZ4h-Dlf71JGa644qK_FSEgOxK9H6aOxoio"}
        name={"Omar"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
      />
    </>
  );
}

export default Talents;
