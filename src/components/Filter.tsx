import React, { useCallback, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todosFormServer: Todo[] | null;
  setTodos: (todos: Todo[]) => void;
  updateList: () => void;
  deleteTodo: (id: number) => void;
};

enum TypeFilter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

function getCount(serverTodos: Todo[] | null) {
  let count = 0;

  if (serverTodos && serverTodos.length > 0) {
    serverTodos.forEach(todo => {
      if (todo.completed === false) {
        count++;
      }
    });
  }

  return count;
}

export const Filter: React.FC<Props> = ({
  setTodos,
  updateList,
  todosFormServer,
  deleteTodo,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(TypeFilter.All);

  const onlyActive = useCallback(() => {
    if (todosFormServer) {
      const newTodos: Todo[] = todosFormServer.filter((todo: Todo) => {
        return todo.completed === false;
      });

      setTodos(newTodos);
    }
  }, [todosFormServer, setTodos]);

  const onlyCompleted = useCallback(() => {
    if (todosFormServer) {
      const newTodos: Todo[] = todosFormServer.filter((todo: Todo) => {
        return todo.completed === true;
      });

      setTodos(newTodos);
    }
  }, [todosFormServer, setTodos]);

  const clearCompleted = useCallback(() => {
    if (todosFormServer) {
      todosFormServer.map((todo: Todo) => {
        if (todo.completed === true) {
          deleteTodo(todo.id);
        }
      });
    }
  }, [todosFormServer, deleteTodo]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${getCount(todosFormServer)} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === TypeFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            setSelectedFilter(TypeFilter.All);
            updateList();
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === TypeFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            setSelectedFilter(TypeFilter.Active);
            onlyActive();
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === TypeFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            setSelectedFilter(TypeFilter.Completed);
            onlyCompleted();
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosFormServer?.some(todo => todo.completed === true)}
        onClick={() => {
          clearCompleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
