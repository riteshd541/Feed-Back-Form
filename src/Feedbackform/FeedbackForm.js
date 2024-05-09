import React, { Component } from "react";
import {
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Typography,
  Container,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Radio,
} from "@material-ui/core";

class FeedbackForm extends Component {
  state = {
    questions: [],
    companyLogo: "",
    unitName: "",
    showDialog: false, // State to control dialog visibility
  };

  componentDidMount() {
    this.fetchQuestions();
  }

  fetchQuestions = () => {
    fetch(
      "https://brijfeedback.pythonanywhere.com/api/get-feedback-questions/?unitID=1"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 1) {
          const questions = data.feedbackQuestions.map((question, index) => ({
            question: question,
            choices: data.choices[index],
            answer: "",
          }));
          this.setState({
            questions,
            companyLogo: data.companyLogo,
            unitName: data.unitName,
          });
        } else {
          throw new Error(data.error_msg || "Error fetching questions");
        }
      })
      .catch((error) =>
        console.error("There was an error fetching the questions:", error)
      );
  };

  handleChoiceChange = (index, choice) => {
    const questions = [...this.state.questions];
    questions[index].answer = choice;
    this.setState({ questions });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const unansweredQuestions = this.state.questions.filter(
      (question) => question.answer === ""
    );
    if (unansweredQuestions.length > 0) {
      // Display an alert message if any question is unanswered
      alert("Please answer all the questions to submit.");
    } else {
      console.log("Feedback submitted:", this.state.questions);
      this.setState({ showDialog: true }); // Show the dialog upon form submission
    }
  };

  handleCloseDialog = () => {
    // Close the dialog
    this.setState({ showDialog: false }, () => {
      // Refresh the page after the dialog is closed
      window.location.reload();
    });
  };

  render() {
    return (
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <img
              src={this.state.companyLogo}
              alt="Company Logo"
              style={{ width: "200px", marginBottom: "20px" }}
            />
            <Typography variant="h4">
              Feedback for {this.state.unitName}
            </Typography>
          </Grid>
        </Grid>

        <form onSubmit={this.handleSubmit}>
          <Table>
            <TableBody>
              {this.state.questions.map((question, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{
                      color: "rgba(0, 0, 0, 0.87)",
                      border: "1px solid ",
                    }}
                  >
                    <Typography variant="h5">{question.question}</Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      color: "rgba(0, 0, 0, 0.87)",
                      border: "1px solid",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={question.answer}
                        onChange={(event) =>
                          this.handleChoiceChange(index, event.target.value)
                        }
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        {question.choices.map((choice, choiceIndex) => (
                          <FormControlLabel
                            key={choiceIndex}
                            value={choice}
                            control={<Radio />}
                            label={<Typography>{choice}</Typography>}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            style={{ marginTop: "10px" }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit Feedback
          </Button>
        </form>

        <Dialog
          open={this.state.showDialog}
          onClose={this.handleCloseDialog}
          aria-labelledby="feedback-dialog-title"
          aria-describedby="feedback-dialog-description"
        >
          <DialogTitle id="feedback-dialog-title">
            {"Feedback Submitted Successfully"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="feedback-dialog-description">
              Thank you for your feedback. Here's a summary of your responses:
              <ul>
                {this.state.questions.map((question, index) => (
                  <li key={index}>
                    <span style={{ color: "black" }}>
                      {" "}
                      {`${question.question}`}
                    </span>
                    <span style={{ color: "blue" }}>
                      {" "}
                      {` ${question.answer}`}
                    </span>
                  </li>
                ))}
              </ul>
            </DialogContentText>
          </DialogContent>
          <Button onClick={this.handleCloseDialog} color="primary">
            Close
          </Button>
        </Dialog>
      </Container>
    );
  }
}

export default FeedbackForm;
