import { addItem } from "@/lib/userData";
import { useRouter } from "next/router";
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

export default function Add() {
  const router = useRouter();

  const [itemData, setItemData] = useState({
    name: "",
    due: new Date().toISOString().slice(0, 10),
    urgency: 3,
    impact: 3,
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
    await addItem(itemData.name, itemData.due, itemData.urgency, itemData.impact);
    router.push('/');
  }

  return (
    <div className="page-narrow">
      <h1 className="page-title">Add New Task</h1>
      <p className="page-subtitle">Describe what needs doing and how much it matters.</p>

      <Card className="prior-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Task name</Form.Label>
              <Form.Control type="text" placeholder="e.g. Finish quarterly report" required name="name" onChange={handleInput}/>
              <Form.Text>Be specific enough that future-you remembers what this means.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Due date</Form.Label>
              <Form.Control type="date" required name="due" value={itemData.due} onChange={handleInput}/>
            </Form.Group>

            <div className="form-section">
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center gap-2">
                  Impact <span className="slider-value">{itemData.impact}</span>
                </Form.Label>
                <Form.Control type="range" min="1" max="5" value={itemData.impact} required name="impact" onChange={handleInput}/>
                <Form.Text>The consequence of doing (or not doing) this. Main driver of priority along with the due date.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="d-flex align-items-center gap-2">
                  Urgency <span className="slider-value">{itemData.urgency}</span>
                </Form.Label>
                <Form.Control type="range" min="1" max="5" value={itemData.urgency} required name="urgency" onChange={handleInput}/>
                <Form.Text>How pressing it feels. Used only to break ties between tasks of similar impact and due date.</Form.Text>
              </Form.Group>
            </div>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit">Add task</Button>
              <Button variant="outline-secondary" onClick={() => router.back()}>Cancel</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}