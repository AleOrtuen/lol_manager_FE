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

  const [formTeam, setFormTeam] = useState({
    name: "",
    tag: "",
    file: null,
    error: "",
  });

  const [preview, setPreview] = useState(null);

  const teamRegistration = async () => {
    const team = { name: formTeam.name, tag: formTeam.tag };
    const file = formTeam.file;

    await teamSave(team, file)
      .then((response) => {
        let newTeam = response.data.objResponse.idTeam;
        const member = {
          user: { idUser: user.idUser },
          team: { idTeam: newTeam },
          admin: true,
        };

        teamMemberSave(member)
          .then((response) => {

          })
          .catch(error => {
            console.log(error.response?.data?.response || error)
          });
        alert("Team registrato correttamente");
      })
      .catch(error => {
        alert("Team esistente")
        console.log(error.response?.data?.response || error);
      });
    navigate(TEAMS);
  };

  const errorChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        if (!validName(value) && value !== "") {
          setFormTeam((prev) => ({
            ...prev,
            error: "Nome di almeno 2 caratteri.",
          }));
        } else if (formTeam.error === "Nome di almeno 2 caratteri.") {
          setFormTeam((prev) => ({ ...prev, error: "" }));
        }
        break;
      case "tag":
        if (!validTag(value) && value !== "") {
          setFormTeam((prev) => ({
            ...prev,
            error: "Tag di almeno 2 caratteri e massimo 5.",
          }));
        } else if (formTeam.error === "Tag di almeno 2 caratteri e massimo 5.") {
          setFormTeam((prev) => ({ ...prev, error: "" }));
        }
        break;
      default:
        break;
    }
  };

  const validForm = () => validName(formTeam.name) && validTag(formTeam.tag);
  const validName = (name) => name.length >= 2 && name.length <= 50;
  const validTag = (tag) => tag.length >= 2 && tag.length <= 5;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      const file = files[0];
      setFormTeam((prev) => ({ ...prev, file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormTeam((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKey = (e) => e.key === "Enter" && teamRegistration();

  return (
    <div>
      <Navbar />
      {/* HEADER CON SFONDO COME NELLA VERSIONE ORIGINALE */}
      <header className="bg-gray bg-gradient text-white py-5">
        <div className="container">
          <h1 className="display-6 text-center mb-5">CREAZIONE TEAM</h1>

          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-sm-12">
              <div
                className="card bg-dark bg-opacity-75 p-4 rounded-4 shadow-lg"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div className="row align-items-center">
                  {/* COLONNA IMMAGINE */}
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
                          alt="Anteprima"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
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

                  {/* COLONNA INPUT */}
                  <div className="col-md-7">
                    <form>
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          type="text"
                          id="name"
                          name="name"
                          value={formTeam.name}
                          placeholder="nome"
                          onChange={handleChange}
                          onKeyDown={handleKey}
                          onBlur={errorChange}
                          style={{
                            borderColor: validName(formTeam.name)
                              ? "green"
                              : formTeam.name
                                ? "red"
                                : "",
                            borderWidth: formTeam.name ? "3px" : "0",
                          }}
                        />
                        <label htmlFor="name">Nome</label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          type="text"
                          id="tag"
                          name="tag"
                          maxLength="5"
                          value={formTeam.tag}
                          placeholder="tag"
                          onChange={handleChange}
                          onKeyDown={handleKey}
                          onBlur={errorChange}
                          style={{
                            borderColor: validTag(formTeam.tag)
                              ? "green"
                              : formTeam.tag
                                ? "red"
                                : "",
                            borderWidth: formTeam.tag ? "3px" : "0",
                          }}
                        />
                        <label htmlFor="tag">Tag</label>
                      </div>
                    </form>

                    {formTeam.error && (
                      <div className="text-warning mb-3">{formTeam.error}</div>
                    )}

                    <button
                      className="btn btn-purple w-100 fw-bold"
                      disabled={!validForm()}
                      onClick={teamRegistration}
                    >
                      Crea team
                    </button>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <span
                    className="text-warning"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(TEAMS)}
                  >
                    Torna ai teams
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
