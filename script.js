      document.addEventListener('DOMContentLoaded', function() {
            const operationSelect = document.getElementById('operation');
            const num3Group = document.getElementById('num3-group');
            const num4Group = document.getElementById('num4-group');
            const addExerciseBtn = document.getElementById('add-exercise-btn');
            const exercisesContainer = document.getElementById('exercises-container');
            const scoreElement = document.getElementById('score');
            
            let exercises = [];
            let score = { correct: 0, total: 0 };


            // Mostrar/ocultar campos adicionales según la operación
            operationSelect.addEventListener('change', function() {
                if (this.value === 'suma' || this.value === 'resta') {
                    num3Group.style.display = 'block';
                    num4Group.style.display = 'block';
                } else {
                    num3Group.style.display = 'none';
                    num4Group.style.display = 'none';
                }
            });

            // Agregar un nuevo ejercicio
            addExerciseBtn.addEventListener('click', function() {
                const operation = document.getElementById('operation').value;
                const num1 = document.getElementById('num1').value;
                const num2 = document.getElementById('num2').value;
                const num3 = document.getElementById('num3').value;
                const num4 = document.getElementById('num4').value;
                
                // Validar entradas
                if (!isValidBinary(num1) || !isValidBinary(num2) || 
                    (num3 && !isValidBinary(num3)) || (num4 && !isValidBinary(num4))) {
                    alert('Por favor, ingresa números binarios válidos (solo 0 y 1)');
                    return;
                }
                
                // Crear el ejercicio
                let exercise = {
                    id: Date.now(),
                    operation,
                    numbers: [num1, num2]
                };
                
                // Agregar números adicionales para suma y resta
                if ((operation === 'suma' || operation === 'resta') && num3) {
                    exercise.numbers.push(num3);
                }
                if ((operation === 'suma' || operation === 'resta') && num4) {
                    exercise.numbers.push(num4);
                }
                
                // Calcular la respuesta correcta
                exercise.correctAnswer = calculateAnswer(exercise);
                
                // Agregar a la lista
                exercises.push(exercise);
                renderExercises();
                
                // Limpiar el formulario
                document.getElementById('num1').value = '';
                document.getElementById('num2').value = '';
                document.getElementById('num3').value = '';
                document.getElementById('num4').value = '';
            });

            // Función para validar números binarios
            function isValidBinary(str) {
                return /^[01]+$/.test(str);
            }

            // Función para calcular la respuesta correcta
            function calculateAnswer(exercise) {
                const nums = exercise.numbers.map(bin => parseInt(bin, 2));
                
                switch(exercise.operation) {
                    case 'suma':
                        let sum = nums.reduce((acc, val) => acc + val, 0);
                        return sum.toString(2);
                    case 'resta':
                        let subtraction = nums[0];
                        for (let i = 1; i < nums.length; i++) {
                            subtraction -= nums[i];
                        }
                        return subtraction.toString(2);
                    case 'multiplicacion':
                        return (nums[0] * nums[1]).toString(2);
                    case 'division':
                        const quotient = Math.floor(nums[0] / nums[1]).toString(2);
                        const remainder = (nums[0] % nums[1]).toString(2);
                        return `${quotient} R ${remainder}`;
                }
            }

            // Renderizar la lista de ejercicios
            function renderExercises() {
                exercisesContainer.innerHTML = '';
                
                if (exercises.length === 0) {
                    exercisesContainer.innerHTML = '<p>No hay ejercicios. Agrega algunos usando el formulario.</p>';
                    return;
                }
                
                exercises.forEach(exercise => {
                    const exerciseElement = document.createElement('div');
                    exerciseElement.className = 'exercise-item';
                    
                    // Crear la representación de la operación
                    let operationSymbol = '';
                    switch(exercise.operation) {
                        case 'suma': operationSymbol = '+'; break;
                        case 'resta': operationSymbol = '-'; break;
                        case 'multiplicacion': operationSymbol = '×'; break;
                        case 'division': operationSymbol = '÷'; break;
                    }
                    
                    let operationText = exercise.numbers.join(` ${operationSymbol} `);
                    
                    exerciseElement.innerHTML = `
                        <div class="exercise-header">
                            <div class="exercise-question">${operationText} = ?</div>
                            <div class="exercise-actions">
                                <button class="solve-btn" data-id="${exercise.id}">Resolver</button>
                                <button class="delete-btn" data-id="${exercise.id}">Eliminar</button>
                            </div>
                        </div>
                        <div class="solution-panel" id="solution-${exercise.id}">
                            <input type="text" id="answer-${exercise.id}" placeholder="Ingresa tu respuesta en binario">
                            <button class="check-btn" data-id="${exercise.id}">Comprobar</button>
                            <div class="result" id="result-${exercise.id}"></div>
                        </div>
                    `;
                    
                    exercisesContainer.appendChild(exerciseElement);
                });
                
                // Agregar event listeners a los botones
                document.querySelectorAll('.solve-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        document.getElementById(`solution-${id}`).style.display = 'block';
                    });
                });
                
                document.querySelectorAll('.check-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const answerInput = document.getElementById(`answer-${id}`);
                        const resultElement = document.getElementById(`result-${id}`);
                        const exercise = exercises.find(e => e.id == id);
                        
                        if (answerInput.value.trim() === exercise.correctAnswer) {
                            resultElement.textContent = '¡Correcto!';
                            resultElement.className = 'result correct';
                            score.correct++;
                        } else {
                            resultElement.textContent = `Incorrecto. La respuesta correcta es: ${exercise.correctAnswer}`;
                            resultElement.className = 'result incorrect';
                        }
                        
                        score.total++;
                        updateScore();
                    });
                });
                
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        exercises = exercises.filter(e => e.id != id);
                        renderExercises();
                    });
                });
                
                updateScore();
            }

            // Actualizar la puntuación
            function updateScore() {
                scoreElement.textContent = `${score.correct}/${score.total} ejercicios correctos`;
            }

            // Inicializar la lista de ejercicios
            renderExercises();
        });
