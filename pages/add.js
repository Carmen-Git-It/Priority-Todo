import { addItem } from "@/lib/userData";
import { useRouter } from "next/router";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";

export default function Add() {
  const router = useRouter();

  const [itemData, setItemData] = useState({
    name: "",
    due: new Date(),
    severity: 1,
    complete: false,
  });

  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setItemData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addItem(itemData.name, itemData.due, itemData.severity);
    router.push('/');
  }

  // TODO: Improve the severity input
  // TODO: Adjust the date input to input the correct date +1 day probably

  return (
    <>
      <h1>Add New Task</h1>
      <br /><br />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Task Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" required name="name" onChange={handleInput}/>
          <Form.Text className="text-muted">
            Make sure the name describes the task with enough detail for you to remember later.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Due Date</Form.Label>
          <Form.Control type="date" required name="due" onChange={handleInput}/>
          <Form.Text className="text-muted">
            The date that the task is due.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Severity: {itemData.severity}</Form.Label>
          <Form.Control type="range" min="1" max="5" defaultValue={itemData.severity} required name="severity" onChange={handleInput}/>
          <Form.Text className="text-muted">
            The importance of the task.
          </Form.Text>
        </Form.Group>

        <Button type="submit">
          Add Task
        </Button>
      </Form>

    </>
  );
}