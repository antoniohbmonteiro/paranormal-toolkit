import {
  ROLL_DETAIL_LIST_SELECTOR,
  ROLL_DETAIL_TOGGLE_SELECTOR,
  WORKFLOW_SECTION_SELECTOR
} from "./item-use-chat-card-constants";

export function removeWorkflowRollDetails(root: ParentNode): void {
  for (const section of Array.from(root.querySelectorAll<HTMLElement>(WORKFLOW_SECTION_SELECTOR))) {
    for (const element of Array.from(section.querySelectorAll<HTMLElement>(`${ROLL_DETAIL_TOGGLE_SELECTOR}, ${ROLL_DETAIL_LIST_SELECTOR}`))) {
      element.remove();
    }
  }
}
