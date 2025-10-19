import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { teamSave } from "../service/teamService";
import { useNavigate } from "react-router-dom";
import { HOME, TEAMS } from "../utils/routes";
import { useSelector } from "react-redux";
import { teamMemberSave } from "../service/teamMemberService";

function TeamForm() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [teamForm, setTeamForm] = useState({
    name: "",
    tag: "",
    file: null,
    error: "",
  });

  const [preview, setPreview] = useState(null);

  const registerTeam = async () => {
    const team = { name: teamForm.name, tag: teamForm.tag };
    const file = teamForm.file;

    try {
      const response = await teamSave(team, file);
      const newTeamId = response.data.objResponse.idTeam;

      const member = {
        user: { idUser: user.idUser },
        team: { idTeam: newTeamId },
        role: user.pRole || "fill",
        admin: true,
      };


      try {
        await teamMemberSave(member);
      } catch (err) {
        console.error(err.response?.data?.response || err);
      }

      alert("Team successfully registered");
      navigate(TEAMS);
    } catch (err) {
      alert("Team already exists");
      console.error(err.response?.data?.response || err);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (!isValidName(value) && value !== "") {
        setTeamForm((prev) => ({ ...prev, error: "Name must be at least 2 characters." }));
      } else if (teamForm.error === "Name must be at least 2 characters.") {
        setTeamForm((prev) => ({ ...prev, error: "" }));
      }
    } else if (name === "tag") {
      if (!isValidTag(value) && value !== "") {
        setTeamForm((prev) => ({ ...prev, error: "Tag must be 2-5 characters long." }));
      } else if (teamForm.error === "Tag must be 2-5 characters long.") {
        setTeamForm((prev) => ({ ...prev, error: "" }));
      }
    }
  };

  const isFormValid = () => isValidName(teamForm.name) && isValidTag(teamForm.tag);
  const isValidName = (name) => name.length >= 2 && name.length <= 50;
  const isValidTag = (tag) => tag.length >= 2 && tag.length <= 5;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      const file = files[0];
      setTeamForm((prev) => ({ ...prev, file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setTeamForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyPress = (e) => e.key === "Enter" && registerTeam();

  return (
    <div>
      <Navbar />
      <header className="bg-gray bg-gradient text-white py-5">
        <div className="container">
          <h1 className="display-6 text-center mb-5">CREATE TEAM</h1>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-sm-12">
              <div
                className="card bg-dark bg-opacity-75 p-4 rounded-4 shadow-lg"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <div className="row align-items-center">
                  {/* IMAGE COLUMN */}
                  <div className="col-md-5 d-flex justify-content-center mb-4 mb-md-0">
                    <label
                      htmlFor="file"
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "200px",
                        height: "200px",
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                        overflow: "hidden",
                      }}
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: "2rem", color: "#999" }}>+</span>
                      )}
                    </label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept="image/*"
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                  </div>

                  {/* INPUT COLUMN */}
                  <div className="col-md-7">
                    <form>
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          type="text"
                          id="name"
                          name="name"
                          value={teamForm.name}
                          placeholder="Name"
                          onChange={handleChange}
                          onKeyDown={handleKeyPress}
                          onBlur={handleBlur}
                          style={{
                            borderColor: isValidName(teamForm.name)
                              ? "green"
                              : teamForm.name
                                ? "red"
                                : "",
                            borderWidth: teamForm.name ? "3px" : "0",
                          }}
                        />
                        <label htmlFor="name">Name</label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          type="text"
                          id="tag"
                          name="tag"
                          maxLength="5"
                          value={teamForm.tag}
                          placeholder="Tag"
                          onChange={handleChange}
                          onKeyDown={handleKeyPress}
                          onBlur={handleBlur}
                          style={{
                            borderColor: isValidTag(teamForm.tag)
                              ? "green"
                              : teamForm.tag
                                ? "red"
                                : "",
                            borderWidth: teamForm.tag ? "3px" : "0",
                          }}
                        />
                        <label htmlFor="tag">Tag</label>
                      </div>
                    </form>

                    {teamForm.error && <div className="text-warning mb-3">{teamForm.error}</div>}

                    <button
                      className="btn btn-purple w-100 fw-bold"
                      disabled={!isFormValid()}
                      onClick={registerTeam}
                    >
                      Create Team
                    </button>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <span
                    className="text-warning"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(TEAMS)}
                  >
                    Back to Teams
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default TeamForm;
